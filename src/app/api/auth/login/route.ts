import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { userAdmin } from '@/lib/supabase-admin'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  const cookieStore = await cookies()
  
  // 创建 Supabase 服务器客户端，可以设置 cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          // 这里会在认证成功时被调用，设置会话 cookies
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        },
      },
    }
  )

  try {
    const { identifier, password } = await req.json()

    // 验证输入
    if (!identifier || !password) {
      return NextResponse.json(
        { error: '用户名/邮箱和密码都是必填项' },
        { status: 400 }
      )
    }

    let email = identifier

    // 如果输入的不是邮箱格式，则作为用户名查找
    if (!identifier.includes('@')) {
      try {
        const user = await userAdmin.findByUsername(identifier)
        if (!user) {
          return NextResponse.json(
            { error: '用户不存在' },
            { status: 401 }
          )
        }
        email = user.email
      } catch (error) {
        console.error('查找用户错误:', error)
        return NextResponse.json(
          { error: '用户不存在' },
          { status: 401 }
        )
      }
    }

    // 使用 SSR 客户端登录，会自动设置 cookies
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error('登录错误:', error)
      return NextResponse.json(
        { error: '用户名/邮箱或密码错误' },
        { status: 401 }
      )
    }

    // 获取用户的完整业务数据
    const userProfile = await userAdmin.findByEmail(email)

    return NextResponse.json(
      {
        success: true,
        message: '登录成功',
        user: {
          id: data.user.id,
          email: data.user.email,
          username: userProfile?.username || data.user.user_metadata?.username || '',
          name: userProfile?.username || data.user.user_metadata?.name || '',
          value: userProfile?.value || 0,
          buytype: userProfile?.buytype || 0,
          buydate: userProfile?.buydate || null,
        }
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('登录错误:', error)
    return NextResponse.json(
      { error: '登录失败，请重试' },
      { status: 500 }
    )
  }
}