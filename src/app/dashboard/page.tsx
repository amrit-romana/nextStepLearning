'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/store/auth'
import Link from 'next/link'
import { LogOut, BookOpen, Clock, Key } from 'lucide-react'

interface StudentData {
  id: string
  user_id: string
  school?: string
  status: string
}

interface ClassData {
  id: string
  name: string
  year_level: number
  subject: string
}

interface EnrollmentData {
  id: string
  class_id: string
  entrance_number: string
  is_active: boolean
  payment_status: string
  classes: ClassData
}

export default function DashboardPage() {
  const router = useRouter()
  const { user, logout, checkAuth, isLoading } = useAuthStore()
  const supabase = createClient()

  const [student, setStudent] = useState<StudentData | null>(null)
  const [enrollments, setEnrollments] = useState<EnrollmentData[]>([])
  const [dashboardLoading, setDashboardLoading] = useState(true)

  useEffect(() => {
    const initializeDashboard = async () => {
      await checkAuth()

      if (!user) {
        router.push('/auth/login')
        return
      }

      // Fetch student data
      const { data: studentData } = await supabase
        .from('students')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (studentData) {
        setStudent(studentData)

        // Fetch enrollments
        const { data: enrollmentData } = await supabase
          .from('enrollments')
          .select(`
            id,
            class_id,
            entrance_number,
            is_active,
            payment_status,
            classes (
              id,
              name,
              year_level,
              subject
            )
          `)
          .eq('student_id', studentData.id)

        if (enrollmentData) {
          setEnrollments(enrollmentData as EnrollmentData[])
        }
      }

      setDashboardLoading(false)
    }

    initializeDashboard()
  }, [user, router, supabase, checkAuth])

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  const handleEnrollSubject = async (subject: string) => {
    // Redirect to enrollment form with subject as parameter
    router.push(`/dashboard/enrollment-form?subject=${subject}`)
  }

  if (isLoading || dashboardLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-900 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const activeEnrollments = enrollments.filter(e => e.is_active && e.payment_status === 'completed')
  const pendingEnrollments = enrollments.filter(e => e.payment_status === 'pending')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40 border-b border-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-gray-700 transition">
            Next Step Learning Dashboard
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">Welcome, {user.user_metadata?.full_name || user.email}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Classes</p>
                <p className="text-3xl font-bold text-gray-900">{activeEnrollments.length}</p>
              </div>
              <BookOpen className="text-gray-400" size={40} opacity={0.2} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pending Enrollment</p>
                <p className="text-3xl font-bold text-gray-700">{pendingEnrollments.length}</p>
              </div>
              <Clock className="text-gray-400" size={40} opacity={0.2} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Account Status</p>
                <p className="text-lg font-semibold text-gray-900 capitalize">{student?.status || 'Active'}</p>
              </div>
              <Key className="text-gray-400" size={40} opacity={0.2} />
            </div>
          </div>
        </div>

        {/* Active Classes */}
        {activeEnrollments.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Your Classes</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeEnrollments.map((enrollment) => (
                <Link
                  key={enrollment.id}
                  href={`/dashboard/class/${enrollment.class_id}`}
                  className="card-interactive"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        Year {enrollment.classes.year_level}
                      </h3>
                      <p className="text-gray-700">{enrollment.classes.subject}</p>
                    </div>
                    <span className="bg-gray-200 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">
                      Active
                    </span>
                  </div>

                  <div className="bg-gray-100 p-4 rounded-lg mb-4 border border-gray-300">
                    <p className="text-xs text-gray-600 mb-1">Entrance Number</p>
                    <p className="text-lg font-mono font-bold text-gray-900">
                      {enrollment.entrance_number}
                    </p>
                  </div>

                  <button className="text-gray-900 hover:text-gray-700 font-semibold text-sm">
                    Access Class →
                  </button>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* No Active Classes - Show Pricing */}
        {activeEnrollments.length === 0 && (
          <section className="mb-12">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Get Started with Online Tutoring</h2>
              <p className="text-gray-600">Choose a subject and start learning today</p>
            </div>
            
            {/* Pricing Cards */}
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
              {[
                { subject: 'Mathematics', price: 98, hourlyRate: 20, classes: 5 },
                { subject: 'Science', price: 98, hourlyRate: 20, classes: 5 },
              ].map((plan) => (
                <div key={plan.subject} className="bg-white shadow-lg border border-gray-300 rounded-lg overflow-hidden hover:shadow-xl transition">
                  <div className="p-8">
                    <h3 className="text-2xl font-bold mb-6 text-center text-gray-900">{plan.subject}</h3>
                    
                    <div className="mb-8 text-center bg-opacity-10 bg-gray-200 rounded-lg py-6">
                      <p className="text-gray-600 text-sm mb-2">Hourly Rate</p>
                      <span className="text-5xl font-bold block text-gray-900">
                        ${plan.hourlyRate}
                      </span>
                      <span className="text-lg text-gray-600">
                        /hour
                      </span>
                    </div>

                    <div className="mb-8 bg-opacity-10 bg-gray-300 rounded-lg p-4">
                      <p className="font-semibold mb-3 text-center text-gray-900">
                        Weekly Billing
                      </p>
                      <div className="text-center">
                        <p className="text-3xl font-bold text-gray-900">
                          ${plan.price}
                        </p>
                        <p className="text-gray-600">
                          per week per subject
                        </p>
                      </div>
                    </div>

                    <div className="mb-8 space-y-3">
                      {['$20/hour', 'Billed weekly', '5 classes per subject', 'Live sessions'].map((feature) => (
                        <div key={feature} className="flex items-start gap-2">
                          <span className="text-green-500 mt-1">✓</span>
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mb-8 pb-8 border-t border-gray-300">
                      <h4 className="font-semibold mb-3 text-center text-gray-900">
                        Breakdown
                      </h4>
                      <ul className="space-y-2 text-center text-gray-700">
                        <li>Classes per Subject: {plan.classes}</li>
                        <li>Billed: Weekly</li>
                      </ul>
                    </div>

                    <button
                      onClick={() => handleEnrollSubject(plan.subject)}
                      className="block text-center py-3 rounded-lg font-semibold transition bg-black text-white hover:bg-gray-800 w-full"
                    >
                      Enroll Now
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pending Enrollments Message */}
            {pendingEnrollments.length > 0 && (
              <div className="bg-blue-50 border border-blue-300 rounded-lg p-6 max-w-2xl mx-auto">
                <p className="text-blue-900 font-semibold mb-4">You have pending enrollments. Complete payment to activate your classes:</p>
                <div className="space-y-3">
                  {pendingEnrollments.map((enrollment) => (
                    <div key={enrollment.id} className="flex justify-between items-center bg-white p-4 rounded border border-blue-200">
                      <span className="font-medium text-gray-900">
                        {enrollment.classes.subject}
                      </span>
                      <Link
                        href={`/dashboard/payment/${enrollment.id}`}
                        className="px-4 py-2 bg-black text-white rounded font-semibold hover:bg-gray-800 transition text-sm"
                      >
                        Complete Payment
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Pending Enrollments */}
        {pendingEnrollments.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Pending Payments</h2>
            <div className="bg-gray-100 border-l-4 border-gray-900 p-6 rounded">
              <h3 className="font-semibold text-lg mb-4 text-gray-900">Complete your enrollment to access classes</h3>
              <div className="space-y-3">
                {pendingEnrollments.map((enrollment) => (
                  <div key={enrollment.id} className="flex justify-between items-center">
                    <span className="font-medium text-gray-900">
                      Year {enrollment.classes.year_level} - {enrollment.classes.subject}
                    </span>
                    <Link
                      href={`/dashboard/payment/${enrollment.id}`}
                      className="btn-primary text-sm"
                    >
                      Complete Payment
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Enroll in More Classes - Only show if already has active classes */}
        {activeEnrollments.length > 0 && (
          <section className="bg-gray-100 rounded-lg shadow p-8 text-center border border-gray-300">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Want to Learn More?</h2>
            <p className="text-gray-600 mb-6">
              Enroll in additional classes
            </p>
            <Link href="/dashboard/enrollment" className="btn-primary">
              Browse Available Classes
            </Link>
          </section>
        )}
      </main>
    </div>
  )
}
