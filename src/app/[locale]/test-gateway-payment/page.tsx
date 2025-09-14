'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { GatewayPaymentModal } from '@/components/gateway-payment-modal'

export default function TestGatewayPaymentPage() {
  const [showPayment, setShowPayment] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'alipay' | 'wechat'>('alipay')

  const testPlan = {
    id: 'test-plan',
    name: '测试套餐',
    price: 0.01
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">支付网关测试页面</h1>
        <p className="text-gray-600">测试支付网关集成功能</p>
      </div>

      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>测试支付</CardTitle>
          <CardDescription>
            点击下方按钮测试支付功能
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">¥0.01</p>
            <p className="text-sm text-gray-500">测试套餐</p>
          </div>
          
          <div className="space-y-2">
            <Button
              onClick={() => {
                setPaymentMethod('alipay')
                setShowPayment(true)
              }}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              支付宝支付测试
            </Button>
            
            <Button
              onClick={() => {
                setPaymentMethod('wechat')
                setShowPayment(true)
              }}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              微信支付测试
            </Button>
          </div>
          
          <div className="text-xs text-gray-500 bg-yellow-50 rounded p-3 border border-yellow-200">
            <p className="font-semibold text-yellow-700 mb-1">测试说明:</p>
            <p>• 这是测试环境，使用0.01元进行测试</p>
            <p>• 需要配置支付网关API密钥</p>
            <p>• 确保回调地址可以正常访问</p>
          </div>
        </CardContent>
      </Card>

      <GatewayPaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        planId={testPlan.id}
        planName={testPlan.name}
        planPrice={testPlan.price}
        paymentMethod={paymentMethod}
      />
    </div>
  )
}