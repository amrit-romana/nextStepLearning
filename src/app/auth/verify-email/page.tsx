'use client'

import Link from 'next/link'
import { Mail, CheckCircle } from 'lucide-react'

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <nav className="w-full bg-white border-b border-gray-300">
        <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <Link href="/" className="text-gray-900 hover:bg-gray-100 p-2 rounded-lg transition">
            ← Back to Home
          </Link>
          <div className="flex items-center gap-2 ml-auto">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <span className="text-gray-900 font-bold text-lg">Next Step Learning</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex items-center justify-center px-4 py-12 min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                  <Mail className="w-10 h-10 text-gray-900" />
                </div>
                <div className="absolute bottom-0 right-0 w-7 h-7 bg-gray-900 rounded-full flex items-center justify-center border-2 border-white">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>

            {/* Heading */}
            <h1 className="text-3xl font-bold text-center mb-3 text-gray-900">
              Check Your Email
            </h1>

            {/* Message */}
            <p className="text-center text-gray-700 mb-6 leading-relaxed">
              We've sent a verification link to your email address. Please check your inbox and click the link to activate your account.
            </p>

            {/* Info Box */}
            <div className="bg-gray-100 border-2 border-gray-300 rounded-lg p-5 mb-8">
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-200">
                    <svg className="w-4 h-4 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-900 font-medium">Didn't receive the email?</p>
                  <p className="text-sm text-gray-700">Check your spam or junk folder. Sometimes emails end up there by mistake.</p>
                </div>
              </div>
            </div>

            {/* What happens next */}
            <div className="bg-gray-50 rounded-lg p-5 mb-8">
              <h3 className="font-semibold text-gray-900 mb-3">What happens next:</h3>
              <ol className="space-y-2 text-sm text-gray-700">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center font-semibold text-xs">1</span>
                  <span>Click the verification link in your email</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center font-semibold text-xs">2</span>
                  <span>Your email will be confirmed</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center font-semibold text-xs">3</span>
                  <span>Sign in to start browsing classes</span>
                </li>
              </ol>
            </div>

            {/* CTA */}
            <div className="text-center">
              <p className="text-gray-700 mb-4">Ready to sign in?</p>
              <Link href="/auth/login" className="inline-block px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition">
                Sign In →
              </Link>
            </div>

            {/* Support */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-xs text-gray-600">
                Need help? <a href="mailto:support@nextsteplearning.com" className="text-gray-900 hover:underline font-medium">Contact support</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
