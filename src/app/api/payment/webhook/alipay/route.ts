import { NextRequest, NextResponse } from 'next/server'
import { handleAlipayNotify } from '@/lib/alipay'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const params: Record<string, string> = {}
    
    // 将 FormData 转换为普通对象
    for (const [key, value] of formData.entries()) {
      params[key] = value as string
    }

    console.log('收到支付宝回调:', params)

    const result = await handleAlipayNotify(params)

    if (result.success) {
      // 支付宝要求返回 success 字符串
      return new Response('success', {
        status: 200,
        headers: { 'Content-Type': 'text/plain' },
      })
    } else {
      console.error('支付宝回调处理失败:', result.message)
      return new Response('failure', {
        status: 400,
        headers: { 'Content-Type': 'text/plain' },
      })
    }
  } catch (error) {
    console.error('支付宝 webhook 处理失败:', error)
    return new Response('failure', {
      status: 500,
      headers: { 'Content-Type': 'text/plain' },
    })
  }
}

// 也支持 GET 请求（支付宝同步回调）
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const params: Record<string, string> = {}
    
    // 将 URLSearchParams 转换为普通对象
    for (const [key, value] of searchParams.entries()) {
      params[key] = value
    }

    console.log('收到支付宝同步回调:', params)

    const result = await handleAlipayNotify(params)

    if (result.success) {
      // 重定向到成功页面
      return NextResponse.redirect(new URL('/subscription/success', request.url))
    } else {
      // 重定向到失败页面
      return NextResponse.redirect(new URL('/subscription/cancel', request.url))
    }
  } catch (error) {
    console.error('支付宝同步回调处理失败:', error)
    return NextResponse.redirect(new URL('/subscription/cancel', request.url))
  }
}