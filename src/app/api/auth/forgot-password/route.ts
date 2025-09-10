import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email || !email.trim()) {
      return NextResponse.json(
        { error: '请提供邮箱地址' },
        { status: 400 }
      )
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: '请输入有效的邮箱地址' },
        { status: 400 }
      )
    }

    // 使用 Supabase Auth 发送密码重置邮件
    const { error } = await supabase.auth.resetPasswordForEmail(
      email.trim(),
      {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/reset-password`,
      }
    )

    if (error) {
      console.error('发送密码重置邮件失败:', error)
      
      // 对于安全考虑，不暴露具体错误信息
      // 无论用户是否存在都返回成功信息
      return NextResponse.json(
        { message: '如果该邮箱已注册，您将收到密码重置邮件' },
        { status: 200 }
      )
    }

    return NextResponse.json(
      { message: '密码重置邮件已发送，请检查您的邮箱' },
      { status: 200 }
    )

  } catch (error) {
    console.error('忘记密码处理错误:', error)
    return NextResponse.json(
      { error: '服务器内部错误，请稍后重试' },
      { status: 500 }
    )
  }
}