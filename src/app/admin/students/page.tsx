'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/store/auth'
import { Eye, Download } from 'lucide-react'

interface StudentData {
  id: string
  user_id: string
  school?: string
  status: string
  profiles: {
    full_name: string
    email: string
    phone?: string
  }
}

interface EnrollmentData {
  id: string
  student_id: string
  class_id: string
  payment_status: string
  is_active: boolean
  entrance_number: string
  classes: {
    name: string
    subject: string
  }
}

export default function ManageStudentsPage() {
  const router = useRouter()
  const { user, checkAuth, isLoading } = useAuthStore()
  const supabase = createClient()

  const [students, setStudents] = useState<StudentData[]>([])
  const [enrollments, setEnrollments] = useState<EnrollmentData[]>([])
  const [pageLoading, setPageLoading] = useState(true)
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null)

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

      // Fetch students
      const { data: studentsData } = await supabase
        .from('students')
        .select(`
          *,
          profiles (
            full_name,
            email,
            phone
          )
        `)

      if (studentsData) {
        setStudents(studentsData as StudentData[])
      }

      // Fetch enrollments
      const { data: enrollmentsData } = await supabase
        .from('enrollments')
        .select(`
          *,
          classes (
            name,
            subject
          )
        `)

      if (enrollmentsData) {
        setEnrollments(enrollmentsData as EnrollmentData[])
      }

      setPageLoading(false)
    }

    initialize()
  }, [user, router, supabase, checkAuth])

  const getStudentEnrollments = (studentId: string) => {
    return enrollments.filter((e) => e.student_id === studentId)
  }

  const handleExportCSV = () => {
    const csv = [
      ['Student Name', 'Email', 'School', 'Status', 'Total Enrollments', 'Active Classes'],
      ...students.map((s) => {
        const studentEnrollments = getStudentEnrollments(s.id)
        return [
          s.profiles.full_name,
          s.profiles.email,
          s.school || 'N/A',
          s.status,
          studentEnrollments.length,
          studentEnrollments.filter((e) => e.is_active).length,
        ]
      }),
    ]
      .map((row) => row.join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'students.csv'
    a.click()
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
          <h1 className="text-2xl font-bold text-slate-900">Manage Students</h1>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 btn-primary"
          >
            <Download size={20} />
            Export CSV
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Student List */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {students.length > 0 ? (
                <table className="w-full">
                  <thead className="bg-slate-100 border-b-2 border-slate-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                        School
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {students.map((student) => (
                      <tr
                        key={student.id}
                        className={`hover:bg-slate-50 transition cursor-pointer ${
                          selectedStudent === student.id ? 'bg-blue-50' : ''
                        }`}
                      >
                        <td className="px-6 py-4 font-medium text-slate-900">
                          {student.profiles.full_name}
                        </td>
                        <td className="px-6 py-4 text-slate-700">{student.profiles.email}</td>
                        <td className="px-6 py-4 text-slate-700">
                          {student.school || 'N/A'}
                        </td>
                        <td className="px-6 py-4">
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold capitalize">
                            {student.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() =>
                              setSelectedStudent(
                                selectedStudent === student.id ? null : student.id
                              )
                            }
                            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                          >
                            <Eye size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-12 text-center">
                  <p className="text-slate-600">No students yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Student Details */}
          <div>
            {selectedStudent ? (
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
                {students
                  .filter((s) => s.id === selectedStudent)
                  .map((student) => {
                    const studentEnrollments = getStudentEnrollments(student.id)
                    return (
                      <div key={student.id}>
                        <h3 className="text-xl font-bold mb-4 text-slate-900">
                          Student Details
                        </h3>

                        <div className="space-y-4 pb-4 border-b border-slate-200">
                          <div>
                            <p className="text-xs text-slate-600 uppercase">Name</p>
                            <p className="font-semibold">
                              {student.profiles.full_name}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-600 uppercase">Email</p>
                            <p className="font-semibold text-blue-600">
                              {student.profiles.email}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-600 uppercase">Phone</p>
                            <p className="font-semibold">
                              {student.profiles.phone || 'N/A'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-600 uppercase">School</p>
                            <p className="font-semibold">
                              {student.school || 'N/A'}
                            </p>
                          </div>
                        </div>

                        {/* Enrollments */}
                        <div className="mt-4">
                          <h4 className="font-semibold text-slate-900 mb-3">
                            Enrollments ({studentEnrollments.length})
                          </h4>
                          <div className="space-y-2">
                            {studentEnrollments.map((enrollment) => (
                              <div
                                key={enrollment.id}
                                className="p-3 bg-slate-50 rounded-lg text-sm"
                              >
                                <p className="font-medium text-slate-900">
                                  {enrollment.classes.name}
                                </p>
                                <p className="text-xs text-slate-600">
                                  {enrollment.classes.subject}
                                </p>
                                <div className="mt-2 flex gap-2">
                                  <span
                                    className={`px-2 py-1 rounded text-xs font-semibold ${
                                      enrollment.payment_status === 'completed'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-orange-100 text-orange-700'
                                    }`}
                                  >
                                    {enrollment.payment_status}
                                  </span>
                                  {enrollment.is_active && (
                                    <span className="px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-700">
                                      Active
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )
                  })}
              </div>
            ) : (
              <div className="bg-slate-50 rounded-lg p-6 text-center sticky top-24">
                <p className="text-slate-600">
                  Click on a student to view details
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
