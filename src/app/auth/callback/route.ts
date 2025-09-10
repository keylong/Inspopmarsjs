import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  console.log('OAuth回调开始处理...')
  
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  console.log('回调参数:', { code: !!code, next })

  if (code) {
    try {
      const supabase = await createServerSupabaseClient()
      console.log('Supabase客户端创建成功')
      
      // 交换授权码获取会话
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('OAuth回调错误:', error)
        return NextResponse.redirect(new URL('/signin?error=auth_failed', request.url))
      }

      console.log('会话交换成功，用户信息:', {
        id: data.user?.id,
        email: data.user?.email,
        name: data.user?.user_metadata?.name || data.user?.user_metadata?.full_name
      })

      if (data.user) {
        try {
          console.log('开始检查数据库中的用户...')
          
          // 检查用户是否已存在于数据库中
          const existingUser = await prisma.user.findUnique({
            where: { email: data.user.email! }
          })

          console.log('数据库查询结果:', { userExists: !!existingUser })

          if (!existingUser) {
            // 创建新用户记录
            console.log('开始创建新用户...')
            
            const userData = {
              email: data.user.email!,
              name: data.user.user_metadata?.name || data.user.user_metadata?.full_name || null,
              image: data.user.user_metadata?.avatar_url || null,
              emailVerified: new Date(), // Google用户默认已验证邮箱
            }
            
            console.log('用户数据:', userData)
            
            const newUser = await prisma.user.create({
              data: userData
            })
            
            console.log('新Google用户创建成功:', newUser)
          } else {
            console.log('Google用户已存在:', existingUser.email)
            
            // 更新用户信息（如头像等）
            if (data.user.user_metadata?.avatar_url && !existingUser.image) {
              await prisma.user.update({
                where: { email: data.user.email! },
                data: { image: data.user.user_metadata.avatar_url }
              })
              console.log('已更新用户头像')
            }
          }
        } catch (dbError) {
          console.error('数据库操作失败，但继续登录流程:', dbError)
          // 即使数据库操作失败，也继续登录流程（用户已在Supabase Auth中）
        }
      }

      // 构建重定向URL
      const redirectUrl = new URL(next, request.url)
      console.log('准备重定向到:', redirectUrl.toString())
      
      // 重定向到首页或指定页面
      return NextResponse.redirect(redirectUrl)
    } catch (error) {
      console.error('OAuth处理错误:', error)
      return NextResponse.redirect(new URL('/signin?error=callback_failed', request.url))
    }
  }

  // 没有授权码，重定向到登录页面
  console.log('没有授权码，重定向到登录页面')
  return NextResponse.redirect(new URL('/signin?error=no_code', request.url))
}