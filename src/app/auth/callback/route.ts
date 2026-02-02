import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Redirect to dashboard after successful authentication
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // Redirect to an error page
  return NextResponse.redirect(new URL('/auth/login?error=oauth-failed', request.url))
}
