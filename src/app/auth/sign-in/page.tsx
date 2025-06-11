import { SignInForm } from '@/components/auth/sign-in-form'
import Link from 'next/link'

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-sm">CTA</span>
            </div>
            <span className="text-xl font-bold text-gray-900">CTAReady</span>
          </Link>
        </div>
        <SignInForm />
      </div>
    </div>
  )
}