'use client'


import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Loader2, CreditCard, Calendar, Download, Check, Crown, Timer, Zap, Shield } from 'lucide-react'
import { SubscriptionPlan, UserSubscription } from '@/types/payment'
import { useI18n } from '@/lib/i18n/client'
import { PaymentModal } from '@/components/payment-modal'

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
  const t = useI18n()
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const params = useParams()
  const locale = params?.locale as string || 'zh-CN'
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null)
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [upgrading, setUpgrading] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  
  // 倒计时状态
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  // 获取当前用户
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getCurrentUser()
  }, [])

  useEffect(() => {
    // 始终获取套餐信息（对所有用户可见）
    fetchPlans()
    
    // 只有登录用户才获取订阅数据
    if (user) {
      fetchSubscriptionData()
    } else {
      setLoading(false) // 未登录用户不需要等待订阅数据
    }
  }, [user])

  // 倒计时逻辑 - 24小时倒计时
  useEffect(() => {
    // 设定结束时间为当天晚上23:59:59
    const today = new Date()
    const endTime = new Date(today)
    endTime.setHours(23, 59, 59, 999)
    
    const updateCountdown = () => {
      const now = new Date()
      const timeDiff = endTime.getTime() - now.getTime()
      
      if (timeDiff > 0) {
        const hours = Math.floor(timeDiff / (1000 * 60 * 60))
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000)
        
        setTimeLeft({ hours, minutes, seconds })
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 })
      }
    }
    
    updateCountdown()
    const timer = setInterval(updateCountdown, 1000)
    
    return () => clearInterval(timer)
  }, [])

  const fetchSubscriptionData = async () => {
    try {
      const response = await fetch('/api/payment/subscription')
      const result = await response.json()
      
      if (result.success) {
        setSubscriptionData(result.data)
      }
    } catch (error) {
      console.error(t('subscription.errors.fetchFailed'), error)
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
      console.error(t('subscription.errors.plansFetchFailed'), error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpgrade = async (planId: string, paymentMethod: 'stripe' | 'alipay' | 'wechat') => {
    // 如果用户未登录，跳转到登录页面
    if (!user) {
      // 保存用户意图到 URL 参数，登录后可以继续
      const returnUrl = `/subscription?plan=${planId}&method=${paymentMethod}`
      router.push(`/signin?returnUrl=${encodeURIComponent(returnUrl)}`)
      return
    }
    
    // 如果是微信支付或支付宝，显示支付弹窗
    if (paymentMethod === 'wechat' || paymentMethod === 'alipay') {
      setShowPaymentModal(true)
      return
    }
    
    // Stripe 支付流程（暂时停用）
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
        alert(t('subscription.errors.checkoutFailed') + ': ' + (result.error || t('subscription.errors.unknownError')))
      }
    } catch (error) {
      console.error(t('subscription.errors.checkoutFailed'), error)
      alert(t('subscription.errors.retryLater'))
    } finally {
      setUpgrading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">{t('subscription.status.active')}</Badge>
      case 'canceled':
        return <Badge variant="secondary">{t('subscription.status.canceled')}</Badge>
      case 'expired':
        return <Badge variant="destructive">{t('subscription.status.expired')}</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">{t('subscription.status.pending')}</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (loading) {
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
      {/* VIP标题栏 */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3">
          <Crown className="h-8 w-8 text-yellow-500" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
            开通VIP
          </h1>
          <Crown className="h-8 w-8 text-yellow-500" />
        </div>
      </div>
    
    <div className="space-y-8">
      {/* 当前订阅状态 */}
      {currentSubscription && currentPlan ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              {t('subscription.currentSubscription')}
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
                  <span className="text-sm text-gray-600">{t('subscription.validUntil')}</span>
                </div>
                <p className="font-medium">
                  {new Date(currentSubscription.currentPeriodEnd).toLocaleDateString('zh-CN')}
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Download className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{t('subscription.usageThisPeriod')}</span>
                </div>
                <p className="font-medium">
                  {usage?.downloadLimit === -1 
                    ? `${usage?.downloadCount} ${t('subscription.times')}（${t('subscription.unlimited')}）`
                    : `${usage?.downloadCount} / ${usage?.downloadLimit} ${t('subscription.times')}`
                  }
                </p>
                {usage?.downloadLimit !== -1 && (
                  <Progress 
                    value={(usage?.downloadCount || 0) / (usage?.downloadLimit || 1) * 100} 
                    className="h-2"
                  />
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{t('subscription.paymentMethod')}</span>
                </div>
                <p className="font-medium">
                  {currentSubscription.paymentMethod === 'stripe' ? 'Stripe' : t('subscription.alipayPayment').replace(' 支付', '')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{t('subscription.noSubscription')}</CardTitle>
            <CardDescription>
              {t('subscription.selectPlan')}
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* 套餐选择 - 新设计 */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-center">{t('subscription.plans')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, index) => {
            const isCurrentPlan = currentPlan?.id === plan.id
            const isYearlyVIP = index === 1 // 第二个是一年VIP会员（根据图片）
            const isYearly = index === 0 // 第一个是年度超级VIP
            const isPro = plan.name.includes('专业版') || plan.name.includes('Pro')
            
            // 设置不同套餐的价格
            let displayPrice = 0
            let originalPrice = 0
            let monthlyPrice = 0
            let saveAmount = 0
            
            if (isYearly) {
              displayPrice = 398
              originalPrice = 668
              saveAmount = 270
              monthlyPrice = displayPrice / 12
            } else if (isYearlyVIP) {
              displayPrice = 188
              originalPrice = 268
              saveAmount = 80
              monthlyPrice = displayPrice / 12
            } else {
              displayPrice = 28
              monthlyPrice = displayPrice
            }
            
            return (
              <Card key={plan.id} className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl ${
                isCurrentPlan ? 'ring-2 ring-blue-500' : ''
              } ${isYearly ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white transform hover:scale-105 border-0' : 
                 isYearlyVIP ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white transform hover:scale-105 border-0' : 'bg-white border border-gray-200'}`}>
                
                {/* 角标 */}
                {isYearly && (
                  <div className="absolute -top-1 -right-1">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-4 py-2 rounded-bl-xl font-bold text-sm shadow-lg">
                      🔥 最受欢迎
                    </div>
                  </div>
                )}
                
                <CardHeader className="text-center">
                  {/* 标题 */}
                  <div className="mb-4">
                    <h3 className={`text-xl font-bold mb-2 ${(isYearly || isYearlyVIP) ? 'text-white' : 'text-gray-800'}`}>
                      {isYearly ? '年度超级VIP' : isYearlyVIP ? '一年 VIP会员' : '一个月 VIP会员'}
                    </h3>
                    {isYearly && (
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 mt-3">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <Timer className="h-4 w-4 text-yellow-300" />
                          <span className="text-sm font-semibold text-yellow-300">限时优惠倒计时</span>
                        </div>
                        <div className="flex justify-center gap-2">
                          <div className="bg-white/20 rounded px-2 py-1 min-w-[40px] text-center">
                            <div className="text-lg font-bold text-white">{String(timeLeft.hours).padStart(2, '0')}</div>
                            <div className="text-xs text-white/80">小时</div>
                          </div>
                          <span className="text-white text-lg font-bold">:</span>
                          <div className="bg-white/20 rounded px-2 py-1 min-w-[40px] text-center">
                            <div className="text-lg font-bold text-white">{String(timeLeft.minutes).padStart(2, '0')}</div>
                            <div className="text-xs text-white/80">分钟</div>
                          </div>
                          <span className="text-white text-lg font-bold">:</span>
                          <div className="bg-white/20 rounded px-2 py-1 min-w-[40px] text-center">
                            <div className="text-lg font-bold text-white">{String(timeLeft.seconds).padStart(2, '0')}</div>
                            <div className="text-xs text-white/80">秒</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* 价格展示 */}
                  <div className="mb-6">
                    <div className="flex items-center justify-center gap-3 mb-2">
                      <span className={`text-4xl font-bold ${(isYearly || isYearlyVIP) ? 'text-white' : 'text-gray-900'}`}>
                        ¥{displayPrice}
                      </span>
                      {originalPrice > 0 && (
                        <span className={`text-xl line-through decoration-2 ${(isYearly || isYearlyVIP) ? 'text-white/60' : 'text-gray-400'}`}>
                          ¥{originalPrice}
                        </span>
                      )}
                    </div>
                    
                    {isYearly && (
                      <Badge className="bg-red-500 text-white">省270元</Badge>
                    )}
                    
                    {isYearly && (
                      <p className="text-white/90 text-sm mt-2">年度无限下载特权</p>
                    )}
                    
                    {isYearlyVIP && (
                      <p className="text-white/90 text-sm mt-2">5000次，一年内有效</p>
                    )}
                    
                    {!isYearly && !isYearlyVIP && (
                      <p className="text-gray-500 text-sm">
                        500次，一个月内有效
                      </p>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* 功能列表 */}
                  <div className="space-y-3">
                    {isYearly ? (
                      // 年度VIP功能列表
                      <>
                        <p className="text-white text-center font-semibold mb-4">
                          👥 3000+用户的选择
                        </p>
                        <div className="space-y-2">
                          <div className={`flex items-center gap-3 p-2 rounded-lg ${isYearly ? 'bg-white/10 backdrop-blur-sm' : 'bg-gray-50'}`}>
                            <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
                              <Download className="h-4 w-4 text-purple-600" />
                            </div>
                            <span className="text-white text-sm">支持下载 图片/视频</span>
                          </div>
                          <div className={`flex items-center gap-3 p-2 rounded-lg ${isYearly ? 'bg-white/10 backdrop-blur-sm' : 'bg-gray-50'}`}>
                            <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
                              <Zap className="h-4 w-4 text-purple-600" />
                            </div>
                            <span className="text-white text-sm">支持下载 多张图片/视频</span>
                          </div>
                          <div className={`flex items-center gap-3 p-2 rounded-lg ${isYearly ? 'bg-white/10 backdrop-blur-sm' : 'bg-gray-50'}`}>
                            <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
                              <Crown className="h-4 w-4 text-orange-500" />
                            </div>
                            <span className="text-white text-sm">
                              <span className="text-yellow-300 font-bold">[新功能]</span> 网页端 一键打包下载功能
                            </span>
                          </div>
                          <div className={`flex items-center gap-3 p-2 rounded-lg ${isYearly ? 'bg-white/10 backdrop-blur-sm' : 'bg-gray-50'}`}>
                            <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
                              <Shield className="h-4 w-4 text-green-500" />
                            </div>
                            <span className="text-white text-sm">
                              <span className="text-green-300 font-bold">[新上线]</span> 批量下载指定博主帖子
                            </span>
                          </div>
                          <div className={`flex items-center gap-3 p-2 rounded-lg ${isYearly ? 'bg-white/10 backdrop-blur-sm' : 'bg-gray-50'}`}>
                            <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
                              <Timer className="h-4 w-4 text-blue-500" />
                            </div>
                            <span className="text-white text-sm">
                              <span className="text-cyan-300 font-bold">[即将上线]</span> 图片提升清晰度功能
                            </span>
                          </div>
                        </div>
                      </>
                    ) : isYearlyVIP ? (
                      // 一年VIP功能列表（根据图片设计）
                      <>
                        <div className="space-y-2">
                          <div className="flex items-center gap-3 p-2 rounded-lg bg-white/10 backdrop-blur-sm">
                            <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
                              <Download className="h-4 w-4 text-blue-600" />
                            </div>
                            <span className="text-white text-sm">支持下载 图片/视频</span>
                          </div>
                          <div className="flex items-center gap-3 p-2 rounded-lg bg-white/10 backdrop-blur-sm">
                            <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
                              <Zap className="h-4 w-4 text-blue-600" />
                            </div>
                            <span className="text-white text-sm">支持下载 多张图片/视频</span>
                          </div>
                          <div className="flex items-center gap-3 p-2 rounded-lg bg-white/10 backdrop-blur-sm">
                            <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
                              <Crown className="h-4 w-4 text-orange-500" />
                            </div>
                            <span className="text-white text-sm">
                              <span className="text-yellow-300 font-bold">[新功能]</span> 网页端 一键打包下载功能
                            </span>
                          </div>
                          <div className="flex items-center gap-3 p-2 rounded-lg bg-white/10 backdrop-blur-sm">
                            <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
                              <Shield className="h-4 w-4 text-green-500" />
                            </div>
                            <span className="text-white text-sm">
                              <span className="text-green-300 font-bold">[新功能]</span> 批量下载指定博主帖子
                            </span>
                          </div>
                        </div>
                      </>
                    ) : (
                      // 一个月VIP功能列表
                      <>
                        <div className="space-y-2">
                          <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                              <Download className="h-4 w-4 text-purple-500" />
                            </div>
                            <span className="text-gray-700 text-sm">支持下载 图片/视频</span>
                          </div>
                          <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                              <Zap className="h-4 w-4 text-purple-500" />
                            </div>
                            <span className="text-gray-700 text-sm">支持下载 多张图片/视频</span>
                          </div>
                          <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
                            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                              <Crown className="h-4 w-4 text-orange-500" />
                            </div>
                            <span className="text-gray-700 text-sm">
                              <span className="text-red-500 font-bold">[新功能]</span> 单帖子 一键打包下载功能
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* 支付按钮 */}
                  {!isCurrentPlan && (
                    <div className="space-y-3 pt-4">
                      <Button
                        onClick={() => handleUpgrade(plan.id, 'wechat')}
                        disabled={upgrading}
                        className={`w-full h-12 text-base font-semibold flex items-center justify-center gap-2 transition-all ${
                          (isYearly || isYearlyVIP)
                            ? 'bg-white/90 text-green-600 hover:bg-green-50'
                            : 'bg-green-500 hover:bg-green-600 text-white'
                        }`}
                      >
                        {upgrading ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <>
                            <span>💸</span>
                            <span>微信支付</span>
                          </>
                        )}
                      </Button>
                      
                      <Button
                        onClick={() => handleUpgrade(plan.id, 'alipay')}
                        disabled={upgrading}
                        className={`w-full h-12 text-base font-semibold flex items-center justify-center gap-2 transition-all ${
                          (isYearly || isYearlyVIP)
                            ? 'bg-white text-blue-600 hover:bg-blue-50'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        {upgrading ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <>
                            <CreditCard className="h-5 w-5" />
                            <span>支付宝</span>
                          </>
                        )}
                      </Button>
                      
                      <p className={`text-center text-sm ${(isYearly || isYearlyVIP) ? 'text-white/80' : 'text-gray-500'}`}>
                        使用帮助
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
      
      {/* 支付弹窗 */}
      <PaymentModal 
        isOpen={showPaymentModal} 
        onClose={() => setShowPaymentModal(false)}
        locale={locale}
      />
      </div>
    </div>
  )
}