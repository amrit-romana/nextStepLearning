import Link from 'next/link'

export default function PricingPage() {
  const plans = [
    {
      subject: 'Mathematics',
      price: 98,
      hourlyRate: 20,
      classes: 5,
      features: ['$20/hour', 'Billed weekly', '5 classes per subject', 'Live sessions'],
    },
    {
      subject: 'Science',
      price: 98,
      hourlyRate: 20,
      classes: 5,
      features: ['$20/hour', 'Billed weekly', '5 classes per subject', 'Live sessions'],
    },
  ]

  return (
    <div className="w-full bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white border-b border-gray-300 z-50">
        <div className="px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">N</span>
            </div>
            <span className="text-xl font-bold text-black">Next Step Learning</span>
          </Link>
          <div className="hidden md:flex gap-8 text-gray-900">
            <Link href="/#features" className="hover:text-gray-600 transition font-medium">Features</Link>
            <Link href="/#stats" className="hover:text-gray-600 transition font-medium">Results</Link>
            <Link href="/pricing" className="hover:text-gray-600 transition font-medium text-black font-bold">Pricing</Link>
            <Link href="/faq" className="hover:text-gray-600 transition font-medium">FAQ</Link>
          </div>
          <div className="flex gap-3">
            <Link href="/auth/login" className="px-5 py-2 text-gray-900 hover:text-gray-600 transition font-medium">Sign In</Link>
            <Link href="/auth/signup" className="px-6 py-2 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition">
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-gradient-to-r from-black to-gray-900 text-white py-32 px-4 mt-20">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-400 mb-2">Our Simple Pricing Model</p>
          <h1 className="text-6xl font-bold mb-6">$20/hour</h1>
          <p className="text-xl text-gray-300">Billed Weekly: $98/week per subject</p>
          <p className="text-lg text-gray-400 mt-2">5 classes per subject</p>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.subject}
              className="bg-white shadow-lg border border-gray-300 rounded-lg overflow-hidden transition-transform hover:scale-105"
            >
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
                  {plan.features.map((feature) => (
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

                <Link
                  href="/auth/signup"
                  className="block text-center py-3 rounded-lg font-semibold transition bg-black text-white hover:bg-gray-800"
                >
                  Get Started
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: 'Can I change my plan anytime?',
                a: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the next billing cycle.',
              },
              {
                q: 'Is there a refund policy?',
                a: 'We offer a 7-day money-back guarantee if you are not satisfied with our service.',
              },
              {
                q: 'Do you offer discounts for yearly subscriptions?',
                a: 'Yes! Subscribe for 12 months and get 15% off. Contact us for details.',
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit cards, debit cards, and digital wallets.',
              },
            ].map((faq, idx) => (
              <details key={idx} className="bg-white rounded-lg shadow p-4 border border-gray-300">
                <summary className="font-semibold cursor-pointer text-gray-900 hover:text-gray-700">
                  {faq.q}
                </summary>
                <p className="mt-3 text-gray-700">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
