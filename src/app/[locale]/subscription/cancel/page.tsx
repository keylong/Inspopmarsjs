'use client'

import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { XCircle } from 'lucide-react'

export default function SubscriptionCancelPage() {
  const router = useRouter()

  return (
    <div className="container mx-auto py-16">
      <Card className="max-w-md mx-auto text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <XCircle className="h-16 w-16 text-red-500" />
          </div>
          <CardTitle className="text-2xl text-red-600">
            支付已取消
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            您的支付已被取消，没有产生任何费用。如有疑问，请随时联系我们。
          </p>
          
          <div className="space-y-2">
            <Button
              onClick={() => router.push('/subscription')}
              className="w-full"
            >
              重新选择套餐
            </Button>
            
            <Button
              onClick={() => router.push('/')}
              variant="outline"
              className="w-full"
            >
              返回首页
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}