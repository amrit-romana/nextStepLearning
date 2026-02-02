'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/store/auth'
import Link from 'next/link'
import { ArrowLeft, AlertCircle } from 'lucide-react'

interface FormData {
  fullName: string
  email: string
  contact: string
  subject: string
  schoolName: string
  previousGradeScore: string
}

export default function EnrollmentFormPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, checkAuth, isLoading: authLoading } = useAuthStore()
  const supabase = createClient()

  const subject = searchParams.get('subject') || 'Mathematics'
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: user?.email || '',
    subject,
    schoolName: '',
    contact: '',
    previousGradeScore: '',
  })

  useEffect(() => {
    let isMounted = true

    const initialize = async () => {
      try {
        await checkAuth()

        if (!isMounted) return

        if (!user) {
          router.push('/auth/login')
          return
        }

        // Pre-fill email from user
        setFormData((prev) => ({
          ...prev,
          email: user.email || '',
          fullName: user.user_metadata?.full_name || '',
        }))
      } catch (err) {
        console.error('Auth check failed:', err)
      }
    }

    if (!user) {
      initialize()
    }

    return () => {
      isMounted = false
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      // Validate form
      if (!formData.fullName || !formData.contact || !formData.schoolName || !formData.previousGradeScore) {
        setError('Please fill in all fields')
        setIsSubmitting(false)
        return
      }

      if (!user?.id) {
        setError('User not authenticated. Please log in again.')
        setIsSubmitting(false)
        return
      }

      // First, ensure profile exists
      try {
        const { data: profileExists } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', user.id)
          .maybeSingle()

        if (!profileExists) {
          // Create profile if it doesn't exist
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              email: user.email,
              full_name: formData.fullName,
              phone: formData.contact,
              role: 'student',
            })

          if (profileError) {
            console.error('Profile creation error:', profileError)
          }
        }
      } catch (err) {
        console.error('Profile check error:', err)
      }

      // Get or create student record
      let studentId: string | null = null
      
      try {
        const { data: existingStudent, error: fetchError } = await supabase
          .from('students')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle()

        if (fetchError) {
          console.error('Fetch error:', fetchError)
        }

        if (existingStudent?.id) {
          studentId = existingStudent.id
        }
      } catch (err) {
        console.error('Error fetching student:', err)
      }

      if (!studentId) {
        // Create new student record
        try {
          const { data: newStudent, error: createError } = await supabase
            .from('students')
            .insert({
              user_id: user.id,
              school: formData.schoolName,
              status: 'active',
            })
            .select()

          if (createError) {
            throw new Error(`Create error: ${createError.message}`)
          }

          if (!newStudent || !newStudent[0]?.id) {
            throw new Error('Failed to create student record')
          }
          studentId = newStudent[0].id
        } catch (err: any) {
          console.error('Error creating student:', err)
          throw err
        }
      }

      if (!studentId) {
        setError('Failed to process student information')
        setIsSubmitting(false)
        return
      }

      // Update student with enrollment info
      try {
        const { error: updateError } = await supabase
          .from('students')
          .update({
            school: formData.schoolName,
          })
          .eq('id', studentId)

        if (updateError) {
          throw new Error(`Update error: ${updateError.message}`)
        }
      } catch (err: any) {
        console.error('Error updating student:', err)
        throw err
      }

      // Fetch the class for this subject
      try {
        const { data: classData, error: classError } = await supabase
          .from('classes')
          .select('id')
          .eq('subject', formData.subject)
          .eq('status', 'active')
          .limit(1)
          .maybeSingle()

        if (classError) {
          throw new Error(`Class fetch error: ${classError.message}`)
        }

        if (!classData?.id) {
          setError(`Class not available for ${formData.subject}. Please contact support.`)
          setIsSubmitting(false)
          return
        }

        // Create enrollment
        const { data: enrollment, error: enrollError } = await supabase
          .from('enrollments')
          .insert({
            student_id: studentId,
            class_id: classData.id,
            payment_status: 'pending',
            entrance_number: `TEMP-${Date.now()}`,
          })
          .select()

        if (enrollError) {
          throw new Error(`Enrollment error: ${enrollError.message}`)
        }

        if (enrollment?.[0]?.id) {
          router.push(`/dashboard/payment/${enrollment[0].id}`)
        } else {
          setError('Failed to create enrollment')
        }
      } catch (err: any) {
        console.error('Error in enrollment process:', err)
        throw err
      }
    } catch (error: any) {
      console.error('Enrollment error:', error)
      setError(error.message || 'Failed to complete enrollment. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40 border-b border-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-900">{formData.subject} Enrollment</h1>
          <p className="text-gray-600 mb-8">Complete your enrollment information to proceed with payment</p>

          {error && (
            <div className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-lg mb-6 text-red-700">
              <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                required
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">Connected to your account</p>
            </div>

            {/* Contact */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                placeholder="+1 (555) 123-4567"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none"
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">Selected subject</p>
            </div>

            {/* School Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                School Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="schoolName"
                value={formData.schoolName}
                onChange={handleChange}
                placeholder="Enter your school name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>

            {/* Previous Grade Score */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Previous Grade Score <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="previousGradeScore"
                value={formData.previousGradeScore}
                onChange={handleChange}
                placeholder="e.g., 85%, A, Grade 8/10"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Your last academic score or grade</p>
            </div>

            {/* Summary */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mt-8">
              <h3 className="font-semibold text-gray-900 mb-4">Enrollment Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subject:</span>
                  <span className="font-semibold text-gray-900">{formData.subject}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Hourly Rate:</span>
                  <span className="font-semibold text-gray-900">$20/hour</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Weekly Billing:</span>
                  <span className="font-semibold text-gray-900">$98/week</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Classes per week:</span>
                  <span className="font-semibold text-gray-900">5</span>
                </div>
                <div className="border-t border-gray-300 pt-3 mt-3 flex justify-between">
                  <span className="text-gray-900 font-semibold">Total Weekly:</span>
                  <span className="text-lg font-bold text-gray-900">$98</span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Processing...' : 'Proceed to Payment'}
              </button>
            </div>
          </form>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="font-semibold text-blue-900 mb-2">What happens next?</h4>
          <ul className="text-sm text-blue-800 space-y-2">
            <li>✓ Review your enrollment details</li>
            <li>✓ Complete secure payment via Stripe</li>
            <li>✓ Receive your entrance number</li>
            <li>✓ Access your classes immediately</li>
          </ul>
        </div>
      </main>
    </div>
  )
}
