'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Home, Receipt } from 'lucide-react'
import Link from 'next/link'

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams?.get('session_id')
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    // 自动跳转倒计时
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          router.push('/profile')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="max-w-md w-full shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-2xl">支付成功！</CardTitle>
          <CardDescription>
            您的订阅已激活，感谢您的支持
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">订单编号</span>
              <span className="font-mono text-xs">
                {sessionId ? sessionId.slice(0, 20) + '...' : 'N/A'}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">支付方式</span>
              <span>Stripe</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">状态</span>
              <span className="text-green-600 dark:text-green-400 font-semibold">
                已完成
              </span>
            </div>
          </div>

          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            {countdown > 0 ? (
              <p>{countdown} 秒后自动跳转到个人中心...</p>
            ) : (
              <p>正在跳转...</p>
            )}
          </div>

          <div className="flex gap-3">
            <Button asChild variant="outline" className="flex-1">
              <Link href="/profile">
                <Receipt className="mr-2 h-4 w-4" />
                查看订阅
              </Link>
            </Button>
            <Button asChild className="flex-1">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                返回首页
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
