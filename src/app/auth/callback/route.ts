import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Redirect to dashboard on successful verification
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // Redirect to sign-in page if there's an error
  return NextResponse.redirect(new URL('/auth/sign-in?error=verification_failed', request.url))
}