'use client'

import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react'
import Link from 'next/link'

export default function PaymentCancelPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams?.get('order_id')

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="max-w-md w-full shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <XCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-2xl">支付已取消</CardTitle>
          <CardDescription>
            您已取消支付，订阅未激活
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {orderId && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">订单编号</span>
                <span className="font-mono text-xs">
                  {orderId.slice(0, 20)}...
                </span>
              </div>
            </div>
          )}

          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            <p>如果您想继续订阅，可以返回订阅页面重新选择套餐</p>
          </div>

          <div className="flex gap-3">
            <Button asChild variant="outline" className="flex-1">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                返回首页
              </Link>
            </Button>
            <Button asChild className="flex-1">
              <Link href="/subscription">
                <RefreshCw className="mr-2 h-4 w-4" />
                重新订阅
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
