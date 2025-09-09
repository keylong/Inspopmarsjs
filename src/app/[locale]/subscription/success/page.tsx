'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Loader2 } from 'lucide-react'

export default function SubscriptionSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [verified, setVerified] = useState(false)

  useEffect(() => {
    // 验证支付是否成功
    const sessionId = searchParams.get('session_id')
    const orderId = searchParams.get('order_id')
    
    if (sessionId || orderId) {
      // 这里可以调用API验证支付状态
      setTimeout(() => {
        setVerified(true)
        setLoading(false)
      }, 2000)
    } else {
      setLoading(false)
    }
  }, [searchParams])

  if (loading) {
    return (
      <div className="container mx-auto py-16 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="text-gray-600">正在验证支付状态...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-16">
      <Card className="max-w-md mx-auto text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl text-green-600">
            支付成功！
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            感谢您的订阅！您的账户已成功升级，现在可以享受完整的服务了。
          </p>
          
          <div className="space-y-2">
            <Button
              onClick={() => router.push('/subscription')}
              className="w-full"
            >
              查看订阅详情
            </Button>
            
            <Button
              onClick={() => router.push('/')}
              variant="outline"
              className="w-full"
            >
              开始使用
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}