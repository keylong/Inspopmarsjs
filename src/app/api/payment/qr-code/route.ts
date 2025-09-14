import { NextRequest, NextResponse } from 'next/server'
import { getPaymentGatewayConfig } from '@/lib/payment-gateway'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const paymentMethod = searchParams.get('method') as 'alipay' | 'wechat'
    const orderId = searchParams.get('orderId')

    if (!paymentMethod || !orderId) {
      return NextResponse.json({
        success: false,
        error: '缺少必要参数'
      }, { status: 400 })
    }

    const config = getPaymentGatewayConfig()

    // 这里应该从支付网关获取实际的收款二维码
    // 根据文档，支付网关系统应该提供收款码获取接口
    try {
      // 调用支付网关获取收款码的API（如果有的话）
      const response = await fetch(`${config.gatewayUrl}/api/qr-code?method=${paymentMethod}&orderId=${orderId}`)
      
      if (response.ok) {
        const result = await response.json()
        if (result.success && result.qrCodeUrl) {
          return NextResponse.json({
            success: true,
            qrCodeUrl: result.qrCodeUrl,
            message: '获取收款码成功'
          })
        }
      }
    } catch (error) {
      console.log('支付网关未提供收款码接口，使用默认处理')
    }

    // 如果支付网关没有提供收款码接口，返回提示信息
    return NextResponse.json({
      success: false,
      error: 'payment_qr_not_configured',
      message: '收款码未配置，请联系管理员在支付网关后台配置收款二维码',
      instructions: {
        alipay: '请在支付宝中保存收款码图片，并在支付网关后台上传',
        wechat: '请在微信中生成收款码，并在支付网关后台上传'
      }
    })

  } catch (error) {
    console.error('获取收款码失败:', error)
    return NextResponse.json({
      success: false,
      error: '服务器错误'
    }, { status: 500 })
  }
}