'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/store/auth'
import { Plus, Edit, Trash2 } from 'lucide-react'

interface ClassData {
  id: string
  name: string
  year_level: number
  subject: string
  price: number
  capacity: number
  status: string
}

export default function ManageClassesPage() {
  const router = useRouter()
  const { user, checkAuth, isLoading } = useAuthStore()
  const supabase = createClient()

  const [classes, setClasses] = useState<ClassData[]>([])
  const [pageLoading, setPageLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    year_level: 8,
    subject: '',
    description: '',
    price: 299,
    capacity: 20,
  })

  useEffect(() => {
    const initialize = async () => {
      await checkAuth()

      if (!user) {
        router.push('/auth/login')
        return
      }

      // Check admin
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile?.role !== 'admin') {
        router.push('/dashboard')
        return
      }

      // Fetch classes
      const { data } = await supabase.from('classes').select('*')
      if (data) {
        setClasses(data as ClassData[])
      }

      setPageLoading(false)
    }

    initialize()
  }, [user, router, supabase, checkAuth])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'capacity' || name === 'year_level' ? Number(value) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const { error } = await supabase.from('classes').insert({
        ...formData,
        status: 'active',
      })

      if (error) throw error

      setShowForm(false)
      setFormData({
        name: '',
        year_level: 8,
        subject: '',
        description: '',
        price: 299,
        capacity: 20,
      })

      // Refresh classes
      const { data } = await supabase.from('classes').select('*')
      if (data) {
        setClasses(data as ClassData[])
      }
    } catch (error) {
      console.error('Error creating class:', error)
      alert('Failed to create class')
    }
  }

  const handleDelete = async (classId: string) => {
    if (!confirm('Are you sure you want to delete this class?')) return

    try {
      const { error } = await supabase.from('classes').delete().eq('id', classId)

      if (error) throw error

      setClasses((prev) => prev.filter((c) => c.id !== classId))
    } catch (error) {
      console.error('Error deleting class:', error)
      alert('Failed to delete class')
    }
  }

  if (isLoading || pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100 ml-64">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-900">Manage Classes</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 btn-primary"
          >
            <Plus size={20} />
            New Class
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="px-8 py-12">
        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">Create New Class</h2>
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Class Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g., Year 8 Mathematics"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Year Level
                </label>
                <select
                  name="year_level"
                  value={formData.year_level}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value={8}>Year 8</option>
                  <option value={9}>Year 9</option>
                  <option value={10}>Year 10</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g., Mathematics"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Monthly Price (₹)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Capacity
                </label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Class description"
                  rows={3}
                />
              </div>

              <div className="md:col-span-2 flex gap-4">
                <button type="submit" className="btn-primary">
                  Create Class
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Classes Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {classes.length > 0 ? (
            <table className="w-full">
              <thead className="bg-slate-100 border-b-2 border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Class</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Year</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Subject</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Price</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Capacity</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {classes.map((cls) => (
                  <tr key={cls.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 font-medium text-slate-900">{cls.name}</td>
                    <td className="px-6 py-4 text-slate-700">Year {cls.year_level}</td>
                    <td className="px-6 py-4 text-slate-700">{cls.subject}</td>
                    <td className="px-6 py-4 text-slate-700">₹{cls.price}</td>
                    <td className="px-6 py-4 text-slate-700">{cls.capacity}</td>
                    <td className="px-6 py-4">
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold capitalize">
                        {cls.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition">
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(cls.id)}
                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center">
              <p className="text-slate-600">No classes yet. Create one to get started!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
