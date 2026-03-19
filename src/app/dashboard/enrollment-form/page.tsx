'use client'

import { Suspense } from 'react'
import EnrollmentFormContent from './enrollment-form-content'

export default function EnrollmentFormPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    }>
      <EnrollmentFormContent />
    </Suspense>
  )
}
