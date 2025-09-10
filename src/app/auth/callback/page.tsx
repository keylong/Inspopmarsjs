'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('客户端OAuth回调开始处理...')
        
        // 检查URL中是否有授权码
        const code = searchParams?.get('code')
        console.log('授权码:', !!code)
        
        if (code) {
          // 使用授权码交换会话
          const { data, error } = await supabase.auth.exchangeCodeForSession(code)
          
          if (error) {
            console.error('交换会话失败:', error)
            router.push('/signin?error=callback_failed')
            return
          }
          
          console.log('OAuth回调成功，用户已认证:', !!data.session?.user)
        } else {
          // 没有授权码，尝试获取现有会话
          const { data } = await supabase.auth.getSession()
          console.log('获取现有会话:', !!data.session?.user)
        }
        
        // 延迟一点再重定向，确保会话已设置
        setTimeout(() => {
          router.push('/')
        }, 1000)
        
      } catch (error) {
        console.error('OAuth回调处理失败:', error)
        router.push('/signin?error=callback_failed')
      }
    }

    handleAuthCallback()
  }, [router, searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">正在完成登录...</p>
      </div>
    </div>
  )
}