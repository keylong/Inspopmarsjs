import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  console.log('OAuth回调开始处理...')
  
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  console.log('回调参数:', { code: !!code, next })

  if (code) {
    try {
      const supabase = await createServerSupabaseClient()
      console.log('Supabase客户端创建成功')
      
      // 交换授权码获取会话
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('OAuth回调错误:', error)
        return NextResponse.redirect(new URL('/signin?error=auth_failed', origin))
      }

      console.log('会话交换成功，重定向到首页')

      // 直接重定向到首页，让客户端的认证上下文处理用户同步
      return NextResponse.redirect(new URL('/', origin))
    } catch (error) {
      console.error('OAuth处理错误:', error)
      return NextResponse.redirect(new URL('/signin?error=callback_failed', origin))
    }
  }

  // 没有授权码，重定向到登录页面
  console.log('没有授权码，重定向到登录页面')
  return NextResponse.redirect(new URL('/signin?error=no_code', origin))
}