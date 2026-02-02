import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Check, Star, Users, BookOpen, Zap, TrendingUp } from 'lucide-react'

export default function Home() {
  return (
    <div className="w-full bg-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white border-b border-gray-300 z-50">
        <div className="px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <Image src="/logo.png" alt="Next Step Learning Logo" width={40} height={40} className="rounded-lg" />
            <span className="text-xl font-bold text-black">Next Step Learning</span>
          </Link>
          <div className="hidden md:flex gap-8 text-gray-900">
            <Link href="#features" className="hover:text-gray-600 transition font-medium">Features</Link>
            <Link href="#stats" className="hover:text-gray-600 transition font-medium">Results</Link>
            <Link href="/pricing" className="hover:text-gray-600 transition font-medium">Pricing</Link>
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

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden bg-white">
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-block mb-6 px-4 py-2 bg-gray-100 rounded-full">
            <span className="text-gray-900 font-semibold text-sm">🎓 Trusted by 5000+ Students</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight text-black">
            Master Your Studies with Expert Guidance
          </h1>
          
          <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
            Get personalized tutoring from experienced educators. Perfect for Year 8, 9, and 10 students aiming for academic excellence.
          </p>
          
          <div className="flex gap-4 justify-center flex-wrap mb-16">
            <Link href="/auth/signup" className="group px-8 py-4 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition transform hover:scale-105 flex items-center gap-2">
              Start Your Journey
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
            </Link>
            <Link href="#features" className="px-8 py-4 border-2 border-gray-900 text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition">
              Explore Features
            </Link>
          </div>

          {/* Hero Stats */}
          <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200">
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">5000+</div>
              <p className="text-gray-600 font-medium">Active Students</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">200+</div>
              <p className="text-gray-600 font-medium">Expert Tutors</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">4.9/5</div>
              <p className="text-gray-600 font-medium">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4 text-black">Why Students Love Next Step Learning</h2>
            <p className="text-xl text-gray-700">Everything you need to succeed in your studies</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <BookOpen className="w-8 h-8" />,
                title: 'Comprehensive Materials',
                desc: 'Access study notes, videos, practice problems, and past exam papers for every topic.',
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: 'Expert Tutors',
                desc: 'Learn from experienced educators with proven track records in helping students excel.',
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: 'Live Classes & Recordings',
                desc: 'Flexible scheduling with live online classes. Recordings available for any you miss.',
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: 'Progress Tracking',
                desc: 'Monitor your improvement with detailed analytics and personalized learning paths.',
              },
              {
                icon: <Check className="w-8 h-8" />,
                title: 'Affordable Pricing',
                desc: 'Quality education at prices that fit your budget. No hidden fees or surprises.',
              },
              {
                icon: <Star className="w-8 h-8" />,
                title: '24/7 Support',
                desc: 'Get help anytime you need it. Our support team is always ready to assist.',
              },
            ].map((feature, idx) => (
              <div key={idx} className="group p-8 bg-gray-50 rounded-2xl border border-gray-200 hover:border-black hover:shadow-xl transition transform hover:scale-105">
                <div className="w-14 h-14 bg-black rounded-lg flex items-center justify-center text-white mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-700 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-20 px-4 bg-black text-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-16">Proven Results</h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { stat: '92%', label: 'Grade Improvement' },
              { stat: '4.9★', label: 'Student Rating' },
              { stat: '200+', label: 'Active Tutors' },
              { stat: '5000+', label: 'Happy Students' },
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="text-5xl font-bold mb-2">{item.stat}</div>
                <p className="text-gray-300">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-black">What Students Say</h2>
            <p className="text-xl text-gray-700">Real testimonials from our community</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Mitchell',
                school: 'Year 10, Brisbane',
                text: 'Next Step Learning helped me improve my math grade from B to A. The tutors are incredibly patient and explain concepts clearly.'
              },
              {
                name: 'James Chen',
                school: 'Year 9, Sydney',
                text: 'Love the flexible scheduling. I can attend classes around my sports commitments. Highly recommend!'
              },
              {
                name: 'Emma Rodriguez',
                school: 'Year 8, Melbourne',
                text: 'The study materials are amazing. I use them to prepare before class, and it makes learning so much easier.'
              },
            ].map((testimonial, idx) => (
              <div key={idx} className="p-8 bg-gray-50 rounded-2xl border border-gray-200 hover:border-black hover:shadow-lg transition">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-gray-900 text-gray-900" />
                  ))}
                </div>
                <p className="text-gray-800 mb-4 leading-relaxed">&quot;{testimonial.text}&quot;</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.school}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6">Ready to Transform Your Grades?</h2>
          <p className="text-xl mb-8 text-gray-300">Start your free trial today. No credit card required.</p>
          <Link href="/auth/signup" className="inline-block px-8 py-4 bg-white text-black rounded-lg font-bold hover:bg-gray-200 transition transform hover:scale-105">
            Get Started Free →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Image src="/logo.png" alt="Next Step Learning Logo" width={32} height={32} className="rounded-lg" />
                <span className="text-white font-bold">Next Step Learning</span>
              </div>
              <p className="text-sm">Making quality education accessible to every student.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/pricing" className="hover:text-white transition">Pricing</Link></li>
                <li><Link href="/faq" className="hover:text-white transition">FAQ</Link></li>
                <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2026 Next Step Learning. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
