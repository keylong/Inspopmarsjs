'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Loader2, CreditCard, Calendar, Download, Check } from 'lucide-react'
import { SubscriptionPlan, UserSubscription } from '@/types/payment'

interface SubscriptionData {
  subscription: UserSubscription | null
  plan: SubscriptionPlan | null
  usage: {
    downloadCount: number
    downloadLimit: number
    remainingDownloads: number
  }
}

export default function SubscriptionPage() {
  const { status } = useSession()
  const router = useRouter()
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null)
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [upgrading, setUpgrading] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    if (status === 'authenticated') {
      fetchSubscriptionData()
      fetchPlans()
    }
  }, [status, router])

  const fetchSubscriptionData = async () => {
    try {
      const response = await fetch('/api/payment/subscription')
      const result = await response.json()
      
      if (result.success) {
        setSubscriptionData(result.data)
      }
    } catch (error) {
      console.error('获取订阅信息失败:', error)
    }
  }

  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/payment/plans')
      const result = await response.json()
      
      if (result.success) {
        setPlans(result.data)
      }
    } catch (error) {
      console.error('获取套餐信息失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpgrade = async (planId: string, paymentMethod: 'stripe' | 'alipay') => {
    setUpgrading(true)
    
    try {
      const response = await fetch('/api/payment/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          paymentMethod,
        }),
      })
      
      const result = await response.json()
      
      if (result.success && result.data?.checkoutUrl) {
        window.location.href = result.data.checkoutUrl
      } else {
        alert('创建支付会话失败: ' + (result.error || '未知错误'))
      }
    } catch (error) {
      console.error('创建支付会话失败:', error)
      alert('创建支付会话失败，请稍后重试')
    } finally {
      setUpgrading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">激活</Badge>
      case 'canceled':
        return <Badge variant="secondary">已取消</Badge>
      case 'expired':
        return <Badge variant="destructive">已过期</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">待支付</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (loading || status === 'loading') {
    return (
      <div className="container mx-auto py-8 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  const currentSubscription = subscriptionData?.subscription
  const currentPlan = subscriptionData?.plan
  const usage = subscriptionData?.usage

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* 当前订阅状态 */}
      {currentSubscription && currentPlan ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              当前订阅
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">{currentPlan.name}</h3>
                <p className="text-gray-600">{currentPlan.description}</p>
              </div>
              {getStatusBadge(currentSubscription.status)}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">有效期至</span>
                </div>
                <p className="font-medium">
                  {new Date(currentSubscription.currentPeriodEnd).toLocaleDateString('zh-CN')}
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Download className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">本周期使用</span>
                </div>
                <p className="font-medium">
                  {usage?.downloadLimit === -1 
                    ? `${usage.downloadCount} 次（无限制）`
                    : `${usage.downloadCount} / ${usage.downloadLimit} 次`
                  }
                </p>
                {usage?.downloadLimit !== -1 && (
                  <Progress 
                    value={(usage.downloadCount / usage.downloadLimit) * 100} 
                    className="h-2"
                  />
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">支付方式</span>
                </div>
                <p className="font-medium">
                  {currentSubscription.paymentMethod === 'stripe' ? 'Stripe' : '支付宝'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>暂无有效订阅</CardTitle>
            <CardDescription>
              选择适合您的订阅套餐开始使用
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* 套餐选择 */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">订阅套餐</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const isCurrentPlan = currentPlan?.id === plan.id
            
            return (
              <Card key={plan.id} className={`relative ${isCurrentPlan ? 'ring-2 ring-blue-500' : ''}`}>
                {isCurrentPlan && (
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500">当前套餐</Badge>
                  </div>
                )}
                
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="text-3xl font-bold">
                    ${plan.price}
                    <span className="text-base font-normal text-gray-600">
                      /{plan.duration === 'monthly' ? '月' : plan.duration === 'yearly' ? '年' : ''}
                    </span>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {!isCurrentPlan && (
                    <div className="space-y-2">
                      <Button
                        onClick={() => handleUpgrade(plan.id, 'stripe')}
                        disabled={upgrading}
                        className="w-full"
                      >
                        {upgrading ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : null}
                        Stripe 支付
                      </Button>
                      
                      <Button
                        onClick={() => handleUpgrade(plan.id, 'alipay')}
                        disabled={upgrading}
                        variant="outline"
                        className="w-full"
                      >
                        {upgrading ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : null}
                        支付宝支付
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}