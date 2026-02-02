'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/store/auth'
import Link from 'next/link'
import { BookOpen, DollarSign } from 'lucide-react'

interface ClassData {
  id: string
  name: string
  year_level: number
  subject: string
  price: number
  description: string
  status: string
}

export default function EnrollmentPage() {
  const router = useRouter()
  const { user, checkAuth, isLoading } = useAuthStore()
  const supabase = createClient()

  const [classes, setClasses] = useState<ClassData[]>([])
  const [selectedClass, setSelectedClass] = useState<ClassData | null>(null)
  const [pageLoading, setPageLoading] = useState(true)

  useEffect(() => {
    const initialize = async () => {
      await checkAuth()

      if (!user) {
        router.push('/auth/login')
        return
      }

      // Fetch available classes
      const { data } = await supabase
        .from('classes')
        .select('*')
        .eq('status', 'active')

      if (data) {
        setClasses(data as ClassData[])
      }

      setPageLoading(false)
    }

    initialize()
  }, [user, router, supabase, checkAuth])

  const handleEnroll = async (classId: string) => {
    try {
      // Get student ID
      const { data: student } = await supabase
        .from('students')
        .select('id')
        .eq('user_id', user?.id)
        .single()

      if (!student) return

      // Create enrollment
      const { data: enrollment, error } = await supabase
        .from('enrollments')
        .insert({
          student_id: student.id,
          class_id: classId,
          payment_status: 'pending',
          entrance_number: `TEMP-${Date.now()}`, // Temporary, will be updated after payment
        })
        .select()

      if (error) throw error

      if (enrollment && enrollment[0]) {
        // Redirect to payment
        router.push(`/dashboard/payment/${enrollment[0].id}`)
      }
    } catch (error) {
      console.error('Enrollment error:', error)
      alert('Failed to enroll in class')
    }
  }

  if (isLoading || pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-slate-600">Loading available classes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-blue-600 hover:text-blue-700 font-semibold">
            ← Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Enroll in Classes</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Classes List */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-6">Available Classes</h2>
            <div className="space-y-4">
              {classes.map((cls) => (
                <div
                  key={cls.id}
                  onClick={() => setSelectedClass(cls)}
                  className={`bg-white rounded-lg shadow-md p-6 cursor-pointer transition hover:shadow-lg ${
                    selectedClass?.id === cls.id ? 'ring-2 ring-blue-600' : ''
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{cls.name}</h3>
                      <p className="text-slate-600 mt-1">{cls.description}</p>
                      <div className="flex gap-4 mt-3 text-sm">
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                          Year {cls.year_level}
                        </span>
                        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                          {cls.subject}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">₹{cls.price}</p>
                      <p className="text-sm text-slate-600">/month</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div>
            {selectedClass ? (
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
                <h3 className="text-xl font-bold mb-4">Enrollment Summary</h3>

                <div className="space-y-4 pb-4 border-b border-slate-200">
                  <div>
                    <p className="text-sm text-slate-600">Class</p>
                    <p className="font-semibold text-slate-900">{selectedClass.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Level</p>
                    <p className="font-semibold text-slate-900">Year {selectedClass.year_level}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Subject</p>
                    <p className="font-semibold text-slate-900">{selectedClass.subject}</p>
                  </div>
                </div>

                <div className="mt-4 pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-700">Monthly Fee</span>
                    <span className="font-bold text-lg">₹{selectedClass.price}</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-4">
                    Billed monthly. Cancel anytime.
                  </p>
                </div>

                <button
                  onClick={() => handleEnroll(selectedClass.id)}
                  className="btn-primary w-full"
                >
                  Continue to Payment
                </button>

                <p className="text-xs text-slate-500 text-center mt-4">
                  After payment, you'll receive your entrance number
                </p>
              </div>
            ) : (
              <div className="bg-slate-50 rounded-lg p-6 text-center sticky top-24">
                <BookOpen size={40} className="mx-auto text-slate-300 mb-4" />
                <p className="text-slate-600">
                  Select a class to view details and enroll
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
