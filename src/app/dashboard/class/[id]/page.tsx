'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/store/auth'
import Link from 'next/link'
import { BookOpen, Clock, Link2, FileText, Video } from 'lucide-react'

interface ClassData {
  id: string
  name: string
  year_level: number
  subject: string
  description: string
}

interface Schedule {
  id: string
  day_of_week: string
  start_time: string
  end_time: string
  zoom_link: string
}

interface Material {
  id: string
  title: string
  type: 'pdf' | 'video' | 'link' | 'note'
  file_url?: string
  external_link?: string
  content_text?: string
}

export default function ClassPage() {
  const router = useRouter()
  const params = useParams()
  const { user, checkAuth, isLoading } = useAuthStore()
  const supabase = createClient()

  const [classData, setClassData] = useState<ClassData | null>(null)
  const [schedule, setSchedule] = useState<Schedule[]>([])
  const [materials, setMaterials] = useState<Material[]>([])
  const [pageLoading, setPageLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'schedule' | 'materials'>('schedule')

  const classId = params?.id as string

  useEffect(() => {
    const initialize = async () => {
      await checkAuth()

      if (!user) {
        router.push('/auth/login')
        return
      }

      // Fetch class details
      const { data: cls } = await supabase
        .from('classes')
        .select('*')
        .eq('id', classId)
        .single()

      if (cls) {
        setClassData(cls as ClassData)
      }

      // Fetch schedule
      const { data: sched } = await supabase
        .from('class_schedule')
        .select('*')
        .eq('class_id', classId)

      if (sched) {
        setSchedule(sched as Schedule[])
      }

      // Fetch materials
      const { data: mat } = await supabase
        .from('study_materials')
        .select('*')
        .eq('class_id', classId)

      if (mat) {
        setMaterials(mat as Material[])
      }

      setPageLoading(false)
    }

    initialize()
  }, [user, router, supabase, checkAuth, classId])

  const getMaterialIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="text-red-600" size={20} />
      case 'video':
        return <Video className="text-purple-600" size={20} />
      case 'link':
        return <Link2 className="text-blue-600" size={20} />
      default:
        return <FileText className="text-slate-600" size={20} />
    }
  }

  if (isLoading || pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-slate-600">Loading class materials...</p>
        </div>
      </div>
    )
  }

  if (!classData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Class not found</p>
          <Link href="/dashboard" className="btn-primary mt-4">
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/dashboard" className="text-blue-600 hover:text-blue-700 font-semibold mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{classData.name}</h1>
              <p className="text-slate-600">Year {classData.year_level} - {classData.subject}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Class Info Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">About This Class</h2>
          <p className="text-slate-700 leading-relaxed">{classData.description}</p>
        </div>

        {/* Tabs */}
        <div className="mb-8 border-b border-slate-200">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('schedule')}
              className={`py-4 px-2 font-semibold border-b-2 transition ${
                activeTab === 'schedule'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Clock className="inline-block mr-2" size={20} />
              Schedule
            </button>
            <button
              onClick={() => setActiveTab('materials')}
              className={`py-4 px-2 font-semibold border-b-2 transition ${
                activeTab === 'materials'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="inline-block mr-2" size={20} />
              Materials
            </button>
          </div>
        </div>

        {/* Schedule Tab */}
        {activeTab === 'schedule' && (
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {schedule.length > 0 ? (
              schedule.map((s) => (
                <div key={s.id} className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-xl font-bold mb-4 text-blue-600">{s.day_of_week}</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-slate-600">Time</p>
                      <p className="font-semibold text-lg">
                        {s.start_time} - {s.end_time}
                      </p>
                    </div>

                    {s.zoom_link && (
                      <a
                        href={s.zoom_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block bg-blue-50 border-2 border-blue-600 rounded-lg p-4 text-blue-600 font-semibold hover:bg-blue-100 transition"
                      >
                        Join Zoom Class →
                      </a>
                    )}

                    {s.notes && (
                      <div>
                        <p className="text-sm text-slate-600">Notes</p>
                        <p className="text-slate-700">{s.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 bg-slate-50 rounded-lg p-8 text-center">
                <Clock size={48} className="mx-auto text-slate-300 mb-4" />
                <p className="text-slate-600">No schedule available yet</p>
              </div>
            )}
          </div>
        )}

        {/* Materials Tab */}
        {activeTab === 'materials' && (
          <div className="space-y-4 mb-12">
            {materials.length > 0 ? (
              materials.map((material) => (
                <div key={material.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4 flex-1">
                      <div className="mt-1">
                        {getMaterialIcon(material.type)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-slate-900">{material.title}</h3>
                        <p className="text-slate-600 text-sm capitalize mt-1">{material.type}</p>
                      </div>
                    </div>

                    {material.file_url && (
                      <a
                        href={material.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary text-sm ml-4"
                      >
                        Download
                      </a>
                    )}

                    {material.external_link && (
                      <a
                        href={material.external_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary text-sm ml-4"
                      >
                        View
                      </a>
                    )}
                  </div>

                  {material.content_text && (
                    <div className="mt-4 p-4 bg-slate-50 rounded-lg text-slate-700">
                      {material.content_text}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="bg-slate-50 rounded-lg p-12 text-center">
                <BookOpen size={48} className="mx-auto text-slate-300 mb-4" />
                <p className="text-slate-600">No materials available yet. Check back soon!</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
