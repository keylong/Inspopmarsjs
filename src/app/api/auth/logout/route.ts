import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function POST(_req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()

    // 使用 Supabase Auth 登出
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('登出错误:', error)
      return NextResponse.json(
        { error: '登出失败，请重试' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: '登出成功' },
      { status: 200 }
    )

  } catch (error) {
    console.error('登出错误:', error)
    return NextResponse.json(
      { error: '登出失败，请重试' },
      { status: 500 }
    )
  }
}