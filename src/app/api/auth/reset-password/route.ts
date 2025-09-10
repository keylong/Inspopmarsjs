import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { password, accessToken, refreshToken } = await req.json()

    if (!password || !password.trim()) {
      return NextResponse.json(
        { error: '请提供新密码' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: '密码长度至少6个字符' },
        { status: 400 }
      )
    }

    if (!accessToken || !refreshToken) {
      return NextResponse.json(
        { error: '无效的重置令牌' },
        { status: 400 }
      )
    }

    // 创建 Supabase 客户端并设置 session
    const supabase = await createServerSupabaseClient()
    
    // 使用令牌设置用户会话
    const { data: { user }, error: sessionError } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    })

    if (sessionError || !user) {
      console.error('设置会话失败:', sessionError)
      return NextResponse.json(
        { error: '无效的重置令牌或令牌已过期' },
        { status: 400 }
      )
    }

    // 使用 Supabase Auth 更新密码
    const { error: updateError } = await supabase.auth.updateUser({
      password: password.trim()
    })

    if (updateError) {
      console.error('密码更新失败:', updateError)
      return NextResponse.json(
        { error: '密码更新失败，请重试' },
        { status: 500 }
      )
    }

    // 同时更新 Prisma 数据库中的密码哈希（如果需要）
    try {
      const hashedPassword = await hash(password.trim(), 12)
      await prisma.user.update({
        where: { email: user.email! },
        data: { password: hashedPassword }
      })
    } catch (prismaError) {
      // 如果 Prisma 更新失败，记录错误但不影响主流程
      console.warn('Prisma 密码更新失败:', prismaError)
    }

    // 登出用户，要求他们重新登录
    await supabase.auth.signOut()

    return NextResponse.json(
      { message: '密码重置成功，请使用新密码登录' },
      { status: 200 }
    )

  } catch (error) {
    console.error('密码重置处理错误:', error)
    return NextResponse.json(
      { error: '服务器内部错误，请稍后重试' },
      { status: 500 }
    )
  }
}