'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/store/auth'
import Link from 'next/link'
import { CheckCircle, AlertCircle } from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface ClassData {
  name: string
  subject: string
  year_level: number
  price: number
}

interface EnrollmentData {
  id: string
  class_id: string
  payment_status: string
  classes: ClassData
}

function PaymentForm({ enrollment, enrollmentId }: { enrollment: EnrollmentData; enrollmentId: string }) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [entranceNumber, setEntranceNumber] = useState('')
  const [paymentComplete, setPaymentComplete] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')

    if (!stripe || !elements) {
      setErrorMessage('Stripe not loaded')
      return
    }

    setIsProcessing(true)

    try {
      // Create payment intent on backend
      const response = await fetch('/api/payment/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enrollmentId,
          amount: 98,
          subject: enrollment.classes.subject,
        }),
      })

      const { clientSecret } = await response.json()

      if (!clientSecret) {
        throw new Error('Failed to create payment intent')
      }

      // Confirm payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      })

      if (result.error) {
        setErrorMessage(result.error.message || 'Payment failed')
      } else if (result.paymentIntent.status === 'succeeded') {
        // Generate entrance number
        const entranceNum = `Y${enrollment.classes.year_level}-${Math.random()
          .toString(36)
          .substring(2, 8)
          .toUpperCase()}`

        // Update enrollment in database
        const supabase = createClient()
        await supabase
          .from('enrollments')
          .update({
            payment_status: 'completed',
            is_active: true,
            entrance_number: entranceNum,
            payment_date: new Date().toISOString(),
          })
          .eq('id', enrollmentId)

        setEntranceNumber(entranceNum)
        setPaymentComplete(true)
      }
    } catch (error: any) {
      setErrorMessage(error.message || 'Payment processing failed')
    } finally {
      setIsProcessing(false)
    }
  }

  if (paymentComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-green-600" size={32} />
          </div>

          <h1 className="text-3xl font-bold mb-4 text-slate-900">Payment Successful!</h1>

          <p className="text-slate-600 mb-6">
            You've successfully enrolled in {enrollment.classes.subject}
          </p>

          <div className="bg-blue-50 border-2 border-blue-600 rounded-lg p-6 mb-6">
            <p className="text-xs text-slate-600 mb-2 uppercase tracking-wider">
              Your Entrance Number
            </p>
            <p className="text-3xl font-mono font-bold text-blue-600">{entranceNumber}</p>
            <p className="text-xs text-slate-600 mt-2">
              Save this number - you'll need it to access your classes
            </p>
          </div>

          <div className="bg-slate-50 rounded-lg p-4 mb-6 text-left">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Subject</span>
                <span className="font-semibold">{enrollment.classes.subject}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Classes per week</span>
                <span className="font-semibold">5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Weekly Fee</span>
                <span className="font-semibold">$98</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => router.push('/dashboard')}
            className="bg-black text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-800 transition w-full"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Card Details
        </label>
        <div className="p-4 border border-gray-300 rounded-lg bg-white">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#374151',
                  '::placeholder': {
                    color: '#9CA3AF',
                  },
                },
              },
            }}
          />
        </div>
      </div>

      {errorMessage && (
        <div className="flex gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
          <p className="text-sm">{errorMessage}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed w-full"
      >
        {isProcessing ? 'Processing...' : `Pay $98 to Enroll`}
      </button>

      <p className="text-xs text-gray-500 text-center">
        Your payment is secured with Stripe. No card details are stored on our servers.
      </p>
    </form>
  )
}

export default function PaymentPage() {
  const router = useRouter()
  const params = useParams()
  const { user, checkAuth, isLoading } = useAuthStore()
  const supabase = createClient()

  const [enrollment, setEnrollment] = useState<EnrollmentData | null>(null)
  const [pageLoading, setPageLoading] = useState(true)

  const enrollmentId = params?.id as string

  useEffect(() => {
    const initialize = async () => {
      await checkAuth()

      if (!user) {
        router.push('/auth/login')
        return
      }

      const { data } = await supabase
        .from('enrollments')
        .select(`
          id,
          class_id,
          payment_status,
          classes (
            name,
            subject,
            year_level,
            price
          )
        `)
        .eq('id', enrollmentId)
        .single()

      if (data) {
        setEnrollment(data as EnrollmentData)
      }

      setPageLoading(false)
    }

    initialize()
  }, [user, router, supabase, checkAuth, enrollmentId])

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

  if (!enrollment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Enrollment not found</p>
          <Link href="/dashboard" className="btn-primary mt-4">
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-slate-900">Complete Payment</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6">Payment Details</h2>

              <Elements stripe={stripePromise}>
                <PaymentForm enrollment={enrollment} enrollmentId={enrollmentId} />
              </Elements>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <h3 className="text-xl font-bold mb-6">Order Summary</h3>

              <div className="space-y-4 pb-4 border-b border-slate-200">
                <div>
                  <p className="text-sm text-slate-600">Subject</p>
                  <p className="font-semibold text-slate-900">{enrollment.classes.subject}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Classes per week</p>
                  <p className="font-semibold text-slate-900">5</p>
                </div>
              </div>

              <div className="mt-4 pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-700">Weekly Fee</span>
                  <span className="font-bold text-lg">$98</span>
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  Billed weekly. Cancel anytime.
                </p>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-blue-900 mb-2">What you get:</p>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>✓ 5 live classes per week</li>
                    <li>✓ Study materials</li>
                    <li>✓ Class recordings</li>
                    <li>✓ 24/7 support</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
