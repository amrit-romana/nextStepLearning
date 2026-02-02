import type { Metadata } from 'next'
import '../styles/globals.css'

export const metadata: Metadata = {
  title: 'Next Step Learning - Year 8-10 Online Tutoring',
  description: 'Quality online tutoring for Year 8, 9, and 10 students. Expert tutors, flexible scheduling, and proven results.',
  keywords: ['tutoring', 'online learning', 'year 8', 'year 9', 'year 10', 'Next Step Learning'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning style={{ scrollBehavior: 'smooth' }}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
