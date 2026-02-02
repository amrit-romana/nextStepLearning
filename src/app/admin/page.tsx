'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/store/auth'
import Link from 'next/link'
import { LogOut, Users, BookOpen, DollarSign } from 'lucide-react'

interface AdminStats {
  totalStudents: number
  totalClasses: number
  totalEnrollments: number
  completedPayments: number
}

export default function AdminDashboard() {
  const router = useRouter()
  const { user, logout, checkAuth, isLoading } = useAuthStore()
  const supabase = createClient()

  const [stats, setStats] = useState<AdminStats>({
    totalStudents: 0,
    totalClasses: 0,
    totalEnrollments: 0,
    completedPayments: 0,
  })
  const [isAdmin, setIsAdmin] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)

  useEffect(() => {
    const initializeAdmin = async () => {
      await checkAuth()

      if (!user) {
        router.push('/auth/login')
        return
      }

      // Check if user is admin
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile?.role !== 'admin') {
        router.push('/dashboard')
        return
      }

      setIsAdmin(true)

      // Fetch stats
      const [studentsRes, classesRes, enrollmentsRes, paymentsRes] =
        await Promise.all([
          supabase.from('students').select('count', { count: 'exact' }),
          supabase.from('classes').select('count', { count: 'exact' }),
          supabase.from('enrollments').select('count', { count: 'exact' }),
          supabase
            .from('enrollments')
            .select('count', { count: 'exact' })
            .eq('payment_status', 'completed'),
        ])

      setStats({
        totalStudents: studentsRes.count || 0,
        totalClasses: classesRes.count || 0,
        totalEnrollments: enrollmentsRes.count || 0,
        completedPayments: paymentsRes.count || 0,
      })

      setPageLoading(false)
    }

    initializeAdmin()
  }, [user, router, supabase, checkAuth])

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  if (isLoading || pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-900 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 w-64 h-screen bg-gray-900 text-white p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-12">Next Step Learning Admin</h1>

        <nav className="space-y-2">
          {[
            { label: 'Dashboard', icon: '📊', href: '/admin' },
            { label: 'Manage Classes', icon: '📚', href: '/admin/classes' },
            { label: 'Manage Students', icon: '👥', href: '/admin/students' },
            { label: 'Enrollments', icon: '📋', href: '/admin/enrollments' },
            { label: 'Materials', icon: '📄', href: '/admin/materials' },
            { label: 'Settings', icon: '⚙️', href: '/admin/settings' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-800 transition"
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-4 py-2 mt-12 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
        >
          <LogOut size={20} />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-40 border-b border-gray-300">
          <div className="px-8 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <span className="text-gray-600">{user?.email}</span>
          </div>
        </header>

        {/* Page Content */}
        <div className="px-8 py-12">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">Welcome back, Admin!</h2>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            {[
              {
                label: 'Total Students',
                value: stats.totalStudents,
                icon: Users,
                color: 'bg-gray-200 text-gray-900',
              },
              {
                label: 'Active Classes',
                value: stats.totalClasses,
                icon: BookOpen,
                color: 'bg-gray-300 text-gray-900',
              },
              {
                label: 'Total Enrollments',
                value: stats.totalEnrollments,
                icon: '📋',
                color: 'bg-gray-200 text-gray-900',
              },
              {
                label: 'Completed Payments',
                value: stats.completedPayments,
                icon: DollarSign,
                color: 'bg-gray-300 text-gray-900',
              },
            ].map((stat, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center mb-4`}>
                  {typeof stat.icon === 'string' ? (
                    <span className="text-2xl">{stat.icon}</span>
                  ) : (
                    <stat.icon size={24} />
                  )}
                </div>
                <p className="text-gray-600 text-sm">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
            <h3 className="text-2xl font-bold mb-6 text-gray-900">Quick Actions</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <Link
                href="/admin/classes/new"
                className="p-6 border-2 border-gray-900 rounded-lg hover:bg-gray-100 transition text-center"
              >
                <BookOpen className="mx-auto text-gray-900 mb-2" size={32} />
                <p className="font-semibold text-gray-900">Create Class</p>
                <p className="text-sm text-gray-600">Add a new course</p>
              </Link>

              <Link
                href="/admin/materials/upload"
                className="p-6 border-2 border-gray-700 rounded-lg hover:bg-gray-100 transition text-center"
              >
                <span className="text-4xl block mb-2">📤</span>
                <p className="font-semibold text-gray-900">Upload Materials</p>
                <p className="text-sm text-gray-600">Add study resources</p>
              </Link>

              <Link
                href="/admin/students"
                className="p-6 border-2 border-gray-800 rounded-lg hover:bg-gray-100 transition text-center"
              >
                <Users className="mx-auto text-gray-900 mb-2" size={32} />
                <p className="font-semibold text-gray-900">View Students</p>
                <p className="text-sm text-gray-600">Manage enrollments</p>
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-lg p-8 mt-8 border border-gray-200">
            <h3 className="text-2xl font-bold mb-6 text-gray-900">Recent Activity</h3>
            <div className="space-y-4">
              {[
                { action: 'New enrollment', details: 'Student enrolled in Year 9 Science', time: '2 hours ago' },
                { action: 'Payment received', details: 'Payment from student completed', time: '4 hours ago' },
                { action: 'Materials uploaded', details: 'Study notes for Year 10 Math', time: '1 day ago' },
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-4 border-b border-gray-300 last:border-b-0">
                  <div>
                    <p className="font-semibold text-gray-900">{item.action}</p>
                    <p className="text-sm text-gray-600">{item.details}</p>
                  </div>
                  <span className="text-xs text-gray-500">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
