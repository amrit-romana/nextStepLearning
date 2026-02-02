# API Routes & Endpoints Reference

## Authentication Endpoints

All authentication is handled through Supabase Auth, but here are the key methods:

### Sign Up
```javascript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
})
```

### Sign In
```javascript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123',
})
```

### Sign Out
```javascript
const { error } = await supabase.auth.signOut()
```

### Get Current User
```javascript
const { data: { user } } = await supabase.auth.getUser()
```

---

## Database Query Examples

### Get All Classes
```javascript
const { data: classes } = await supabase
  .from('classes')
  .select('*')
  .eq('status', 'active')
```

### Get Student's Enrollments
```javascript
const { data: enrollments } = await supabase
  .from('enrollments')
  .select(`
    *,
    classes (*)
  `)
  .eq('student_id', studentId)
  .eq('payment_status', 'completed')
```

### Get Class Materials
```javascript
const { data: materials } = await supabase
  .from('study_materials')
  .select('*')
  .eq('class_id', classId)
```

### Get Class Schedule
```javascript
const { data: schedule } = await supabase
  .from('class_schedule')
  .select('*')
  .eq('class_id', classId)
```

---

## Admin Operations

### Create Class
```javascript
const { data, error } = await supabase
  .from('classes')
  .insert([
    {
      name: 'Year 8 Mathematics',
      year_level: 8,
      subject: 'Mathematics',
      price: 299.99,
      capacity: 20,
      status: 'active'
    }
  ])
```

### Update Class
```javascript
const { data, error } = await supabase
  .from('classes')
  .update({
    name: 'Updated Name',
    price: 350.00
  })
  .eq('id', classId)
```

### Delete Class
```javascript
const { data, error } = await supabase
  .from('classes')
  .delete()
  .eq('id', classId)
```

### Upload Study Material
```javascript
// Upload file
const { data, error } = await supabase.storage
  .from('study-materials')
  .upload(`${classId}/${fileName}`, file)

// Create material record
const { error } = await supabase
  .from('study_materials')
  .insert([
    {
      class_id: classId,
      title: 'Chapter 1 Notes',
      type: 'pdf',
      file_url: data.path,
      created_by: userId
    }
  ])
```

### Add Class Schedule
```javascript
const { error } = await supabase
  .from('class_schedule')
  .insert([
    {
      class_id: classId,
      day_of_week: 'Monday',
      start_time: '18:00',
      end_time: '19:00',
      zoom_link: 'https://zoom.us/j/...'
    }
  ])
```

---

## Enrollment & Payment

### Create Enrollment
```javascript
const { data, error } = await supabase
  .from('enrollments')
  .insert([
    {
      student_id: studentId,
      class_id: classId,
      payment_status: 'pending',
      entrance_number: 'TEMP-' + Date.now()
    }
  ])
```

### Update Enrollment (After Payment)
```javascript
const { error } = await supabase
  .from('enrollments')
  .update({
    payment_status: 'completed',
    is_active: true,
    entrance_number: `Y${yearLevel}-${randomNumber}`,
    payment_date: new Date().toISOString()
  })
  .eq('id', enrollmentId)
```

### Get Enrollment Status
```javascript
const { data: enrollment } = await supabase
  .from('enrollments')
  .select('*')
  .eq('id', enrollmentId)
  .single()
```

---

## Real-time Subscriptions

### Listen for Material Updates
```javascript
const subscription = supabase
  .from(`study_materials:class_id=eq.${classId}`)
  .on('*', (payload) => {
    console.log('Material updated:', payload)
  })
  .subscribe()

// Clean up
subscription.unsubscribe()
```

### Listen for Announcements
```javascript
const subscription = supabase
  .from(`announcements:class_id=eq.${classId}`)
  .on('INSERT', (payload) => {
    console.log('New announcement:', payload.new)
  })
  .subscribe()
```

---

## Error Handling

```javascript
const { data, error } = await supabase
  .from('classes')
  .select('*')

if (error) {
  console.error('Error:', error.message)
  // Handle error
  return
}

// Use data safely
console.log(data)
```

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `PGRST301` | No rows found | Use `.single()` only when you expect 1 row |
| `42501` | Permission denied | Check RLS policies |
| `PGRST116` | Invalid JSON | Validate data structure |
| `PGRST201` | Duplicate key | Check unique constraints |

---

## Rate Limiting & Best Practices

1. **Combine queries** when possible
```javascript
// ❌ Bad: 3 separate queries
const profiles = await supabase.from('profiles').select('*')
const classes = await supabase.from('classes').select('*')
const enrollments = await supabase.from('enrollments').select('*')

// ✅ Good: Single query with join
const enrollments = await supabase
  .from('enrollments')
  .select(`
    *,
    classes (*),
    students (*)
  `)
```

2. **Use RLS for security**
```javascript
// Supabase RLS handles filtering automatically
const enrollments = await supabase
  .from('enrollments')
  .select('*')
// Only returns user's own enrollments if RLS is set up
```

3. **Paginate large datasets**
```javascript
const { data, count } = await supabase
  .from('students')
  .select('*', { count: 'exact' })
  .range(0, 9) // First 10 rows
```

---

## Useful Queries

### Get Admin Statistics
```javascript
const [students, classes, enrollments, payments] = await Promise.all([
  supabase.from('students').select('count', { count: 'exact' }),
  supabase.from('classes').select('count', { count: 'exact' }),
  supabase.from('enrollments').select('count', { count: 'exact' }),
  supabase
    .from('enrollments')
    .select('count', { count: 'exact' })
    .eq('payment_status', 'completed')
])
```

### Get Popular Classes
```javascript
const { data } = await supabase
  .from('enrollments')
  .select('class_id, count')
  .gte('count', 5)
  .order('count', { ascending: false })
  .limit(5)
```

### Search Classes by Subject
```javascript
const { data: classes } = await supabase
  .from('classes')
  .select('*')
  .ilike('subject', `%${query}%`)
```

### Get Student Progress
```javascript
const { data: enrollments } = await supabase
  .from('enrollments')
  .select(`
    *,
    classes (name, subject),
    student:students (
      profiles (full_name)
    )
  `)
  .eq('student_id', studentId)
  .eq('is_active', true)
```

---

## File Operations

### Upload File
```javascript
const file = /* from input */
const { data, error } = await supabase.storage
  .from('study-materials')
  .upload(`${classId}/${file.name}`, file, {
    cacheControl: '3600',
    upsert: false
  })
```

### Download File
```javascript
const { data, error } = await supabase.storage
  .from('study-materials')
  .download('class-1/notes.pdf')
```

### Delete File
```javascript
const { error } = await supabase.storage
  .from('study-materials')
  .remove(['class-1/notes.pdf'])
```

### Get Public URL
```javascript
const { data } = supabase.storage
  .from('study-materials')
  .getPublicUrl('class-1/notes.pdf')

console.log(data.publicUrl) // Direct download link
```

---

## TypeScript Helpers

```typescript
// Generated types from Supabase
import { Database } from '@/types/supabase'

type Student = Database['public']['Tables']['students']['Row']
type Class = Database['public']['Tables']['classes']['Row']
type Enrollment = Database['public']['Tables']['enrollments']['Row']
```

---

## Troubleshooting

### Query returns null
- Check RLS policies
- Verify user has access
- Check query filters

### Upload fails
- Verify bucket exists and is public
- Check file size limits
- Verify CORS settings

### Real-time not updating
- Check subscription active
- Verify RLS allows viewing changes
- Check browser console for errors

---

## Resources

- [Supabase JS Client Docs](https://supabase.com/docs/reference/javascript)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Supabase Database](https://supabase.com/docs/guides/database)
- [Supabase Storage](https://supabase.com/docs/guides/storage)

---

**Last Updated**: January 2026
