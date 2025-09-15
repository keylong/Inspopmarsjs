import { NextRequest, NextResponse } from 'next/server'
import { getPaymentGatewayConfig } from '@/lib/payment-gateway'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') as 'alipay' | 'wechat'
    const amount = searchParams.get('amount')

    if (!type || !amount) {
      return NextResponse.json({
        success: false,
        error: '缺少必要参数'
      }, { status: 400 })
    }

    if (!['alipay', 'wechat'].includes(type)) {
      return NextResponse.json({
        success: false,
        error: '不支持的支付方式'
      }, { status: 400 })
    }

    const config = getPaymentGatewayConfig()
    
    // 代理请求到支付网关
    const qrcodeUrl = `${config.gatewayUrl}/api/qrcode?type=${type}&amount=${amount}`
    
    console.log('代理二维码请求到:', qrcodeUrl)
    
    const response = await fetch(qrcodeUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      console.error('支付网关响应错误:', response.status)
      return NextResponse.json({
        success: false,
        error: '获取二维码失败'
      }, { status: response.status })
    }

    const result = await response.json()
    
    console.log('支付网关二维码响应:', result)
    
    // 直接返回支付网关的响应
    return NextResponse.json(result)

  } catch (error) {
    console.error('获取二维码失败:', error)
    return NextResponse.json({
      success: false,
      error: '服务器错误'
    }, { status: 500 })
  }
}