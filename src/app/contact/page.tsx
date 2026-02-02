import { Mail, Phone, MapPin, Clock } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="bg-black text-white py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
          <p className="text-xl text-gray-300">We'd love to hear from you</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="input-field"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="How can we help?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  rows={5}
                  className="input-field"
                  placeholder="Your message..."
                />
              </div>

              <button type="submit" className="btn-primary w-full">
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <Mail className="text-gray-900" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">Email</h3>
                  <p className="text-gray-700">info@nextsteplearning.com</p>
                  <p className="text-gray-700">support@nextsteplearning.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4 mb-6">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <Phone className="text-gray-900" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">Phone</h3>
                  <p className="text-gray-700">+1 (555) 123-4567</p>
                  <p className="text-sm text-gray-600">Mon-Fri, 9AM-6PM EST</p>
                </div>
              </div>

              <div className="flex items-start gap-4 mb-6">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <MapPin className="text-gray-900" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">Address</h3>
                  <p className="text-gray-700">
                    123 Education Street<br />
                    Learning City, LC 12345<br />
                    United States
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <Clock className="text-gray-900" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">Business Hours</h3>
                  <p className="text-gray-700">
                    Monday - Friday: 9:00 AM - 6:00 PM<br />
                    Saturday: 10:00 AM - 4:00 PM<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Response Info */}
            <div className="bg-gray-100 border-l-4 border-gray-900 p-6 rounded">
              <h3 className="font-semibold mb-2 text-gray-900">Quick Response Times</h3>
              <p className="text-sm text-gray-700">
                ✓ Email: Usually within 2 hours<br />
                ✓ Chat: Real-time support during business hours<br />
                ✓ Phone: 24/7 automated support
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
