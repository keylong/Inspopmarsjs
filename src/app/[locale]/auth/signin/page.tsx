'use client'

import { SignIn } from '@stackframe/stack'
import { useRouter } from 'next/navigation'
import { useI18n } from '@/lib/i18n/client'
import Link from 'next/link'

export default function SignInPage() {
  const router = useRouter()
  const t = useI18n()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            {t('auth.signin.title')}
          </h2>
          <p className="mt-2 text-gray-600">
            {t('auth.errors.loginWithAccount')}
          </p>
        </div>

        {/* Stack Auth 登录组件 */}
        <SignIn 
          afterSignIn={() => router.push('/')}
          // 自定义样式
          className="w-full"
        />

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {t('auth.signin.noAccount')}{' '}
            <Link 
              href="/auth/signup" 
              className="text-blue-600 hover:underline font-medium"
            >
              {t('auth.signin.createAccount')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}