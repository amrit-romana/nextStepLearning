export default function FAQPage() {
  const faqs = [
    {
      category: 'Getting Started',
      questions: [
        {
          q: 'How do I sign up?',
          a: 'Click the "Sign Up" button, provide your email and create a password. You\'ll receive a verification email to activate your account.',
        },
        {
          q: 'Is there an age limit?',
          a: 'StudyHub is designed for Year 8-10 students. Parents can create accounts to manage their child\'s enrollment.',
        },
        {
          q: 'Can I try before paying?',
          a: 'Yes! Browse our free course materials and watch preview videos before enrolling in a full course.',
        },
      ],
    },
    {
      category: 'Classes & Learning',
      questions: [
        {
          q: 'When are classes held?',
          a: 'Live classes are typically held on weekday evenings (6-8 PM) and weekend mornings. All sessions are recorded for later viewing.',
        },
        {
          q: 'What do I need to attend?',
          a: 'A stable internet connection, computer or tablet, and Zoom installed. We send Zoom links for each class.',
        },
        {
          q: 'Can I attend past classes?',
          a: 'Yes! All recorded sessions are available in your dashboard for 12 months.',
        },
      ],
    },
    {
      category: 'Technical Support',
      questions: [
        {
          q: 'What if I have technical issues?',
          a: 'Email support@studyhub.com or use the chat feature in your dashboard. We typically respond within 2 hours.',
        },
        {
          q: 'Which browsers are supported?',
          a: 'Chrome, Firefox, Safari, and Edge. We recommend using the latest version for best experience.',
        },
      ],
    },
    {
      category: 'Payment & Billing',
      questions: [
        {
          q: 'What payment methods do you accept?',
          a: 'We accept all major credit cards, debit cards, Stripe, and digital wallets.',
        },
        {
          q: 'When will I be charged?',
          a: 'Your first charge occurs immediately upon enrollment. Subsequent charges occur on the same date each month.',
        },
        {
          q: 'Can I cancel anytime?',
          a: 'Yes, cancel anytime from your account settings. No questions asked.',
        },
      ],
    },
  ]

  return (
    <div className="w-full">
      {/* Header */}
      <div className="bg-black text-white py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-300">Find answers to common questions about Next Step Learning</p>
        </div>
      </div>

      {/* FAQs */}
      <div className="max-w-4xl mx-auto px-4 py-20">
        {faqs.map((section, idx) => (
          <div key={idx} className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{section.category}</h2>
            <div className="space-y-4">
              {section.questions.map((item, qIdx) => (
                <details key={qIdx} className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition border border-gray-300">
                  <summary className="font-semibold text-lg text-gray-900 hover:text-gray-700">
                    {item.q}
                  </summary>
                  <p className="mt-4 text-gray-700 leading-relaxed">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        ))}

        {/* Contact for more */}
        <div className="bg-gray-100 border-l-4 border-gray-900 p-6 rounded mt-12">
          <h3 className="font-semibold text-lg mb-2 text-gray-900">Still have questions?</h3>
          <p className="text-gray-700 mb-4">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <a href="/contact" className="text-gray-900 hover:text-gray-700 font-semibold">
            Contact us →
          </a>
        </div>
      </div>
    </div>
  )
}
