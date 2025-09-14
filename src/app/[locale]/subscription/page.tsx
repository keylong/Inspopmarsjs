'use client'


import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Loader2, CreditCard, Calendar, Download, Check, Crown, Timer, Zap, Shield, MessageCircle, Copy } from 'lucide-react'
import { SubscriptionPlan } from '@/types/payment'
import { useI18n } from '@/lib/i18n/client'
import { GatewayPaymentModal } from '@/components/gateway-payment-modal'
import { MembershipStatus } from '@/lib/membership'
import { CheckinCard } from '@/components/checkin/checkin-card'

interface UserProfile {
  id: string
  name: string | null
  email: string
  buytype: number
  buydate: Date | null
  value: number
  membership: MembershipStatus
}

export default function SubscriptionPage() {
  const t = useI18n()
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const params = useParams()
  const locale = params?.locale as string || 'zh-CN'
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [upgrading, setUpgrading] = useState(false)
  const [showGatewayPayment, setShowGatewayPayment] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null)
  const [selectedPlanPrice, setSelectedPlanPrice] = useState<number>(0) // 选中套餐的实际显示价格
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'alipay' | 'wechat'>('alipay')
  const [isCreatingOrder, setIsCreatingOrder] = useState(false) // 防止重复创建订单
  const [copied, setCopied] = useState(false) // 复制微信号状态
  
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
    
    // 只有登录用户才获取用户资料
    if (user) {
      fetchUserProfile()
    } else {
      setLoading(false) // 未登录用户不需要等待用户数据
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

  // 复制微信号功能
  const handleCopyWechat = async () => {
    const wechatId = 'popmarscom'
    try {
      await navigator.clipboard.writeText(wechatId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      // 降级处理：使用传统方法
      const textArea = document.createElement('textarea')
      textArea.value = wechatId
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      document.body.appendChild(textArea)
      textArea.select()
      try {
        document.execCommand('copy')
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (fallbackError) {
        console.error('复制失败:', fallbackError)
      }
      document.body.removeChild(textArea)
    }
  }

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/profile')
      const result = await response.json()
      
      if (result.user) {
        setUserProfile(result.user)
      }
    } catch (error) {
      console.error('获取用户资料失败:', error)
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
    
    // 如果是微信支付或支付宝，使用新的支付网关
    if (paymentMethod === 'wechat' || paymentMethod === 'alipay') {
      // 防止重复点击 - 检查多个状态
      if (showGatewayPayment || isCreatingOrder || upgrading) {
        console.log('支付弹窗已打开或正在处理中，防止重复请求')
        return
      }
      
      // 立即设置状态防止重复点击
      setIsCreatingOrder(true)
      
      const plan = plans.find(p => p.id === planId)
      if (plan) {
        // 计算正确的显示价格
        const isYearly = plan.id === 'unlimited-monthly'
        const isYearlyVIP = plan.id === 'pro-monthly'
        const isMonthlyBasic = plan.id === 'basic-monthly'
        
        let displayPrice = 0
        if (isYearly) {
          displayPrice = 398
        } else if (isYearlyVIP) {
          displayPrice = 188
        } else if (isMonthlyBasic) {
          displayPrice = 28
        } else {
          displayPrice = Math.round(plan.price)
        }
        
        setSelectedPlan(plan)
        setSelectedPlanPrice(displayPrice)
        setSelectedPaymentMethod(paymentMethod as 'alipay' | 'wechat')
        setShowGatewayPayment(true)
        // 在模态框打开后重置创建状态，由模态框内部控制
        setTimeout(() => setIsCreatingOrder(false), 100)
      } else {
        setIsCreatingOrder(false)
      }
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

  const membership = userProfile?.membership
  const hasActiveMembership = membership?.isActive || false

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
      {/* 当前会员状态 */}
      {hasActiveMembership ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-500" />
              当前会员状态
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">{membership?.typeName}</h3>
                <p className="text-gray-600">享受VIP会员特权服务</p>
              </div>
              <Badge className="bg-green-100 text-green-800">有效会员</Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">开始时间</span>
                </div>
                <p className="font-medium">
                  {userProfile?.buydate ? new Date(userProfile.buydate).toLocaleDateString('zh-CN') : '-'}
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Download className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">剩余次数</span>
                </div>
                <p className="font-medium">
                  {userProfile && userProfile.value >= 999999 
                    ? '无限次数'
                    : `${userProfile?.value || 0} 次`
                  }
                </p>
                {userProfile && userProfile.value < 999999 && (
                  <Progress 
                    value={Math.max(0, (userProfile.value / 5000) * 100)} 
                    className="h-2"
                  />
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Timer className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {membership?.type === 'lifetime' ? '终身有效' : '到期时间'}
                  </span>
                </div>
                <p className="font-medium">
                  {membership?.type === 'lifetime' 
                    ? '永不过期'
                    : membership?.expiresAt 
                      ? new Date(membership.expiresAt).toLocaleDateString('zh-CN')
                      : '-'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>开通VIP会员</CardTitle>
            <CardDescription>
              选择适合的套餐开通会员服务
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* 免费套餐 */}
      {!hasActiveMembership && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-center">免费套餐</h2>
          
          <Card className="overflow-hidden border-2 border-dashed border-blue-300 bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardHeader className="text-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
              <CardTitle className="flex items-center justify-center gap-2">
                <Crown className="h-6 w-6 text-yellow-300" />
                免费用户 - 每日签到获取下载次数
              </CardTitle>
              <CardDescription className="text-blue-100">
                坚持每日签到，免费获取下载机会！连续签到奖励更丰厚
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* 免费套餐介绍 */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">✨ 免费套餐特权</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Check className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">每日签到</p>
                        <p className="text-sm text-gray-600">基础奖励：3次下载机会</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <Zap className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">连续签到奖励</p>
                        <p className="text-sm text-gray-600">连续7天：5次 | 15天：10次 | 30天：15次</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <Download className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">永久免费</p>
                        <p className="text-sm text-gray-600">无需付费，坚持签到即可使用</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                    <p className="text-sm text-yellow-800">
                      💡 <strong>温馨提示：</strong>签到获得的下载次数会累积，不会过期！坚持签到让您的免费下载次数越来越多。
                    </p>
                  </div>
                </div>
                
                {/* 签到功能 */}
                <div>
                  <CheckinCard />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 套餐选择 - 新设计 */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-center">
          {hasActiveMembership ? '升级套餐' : 'VIP套餐'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.filter(plan => plan.id !== 'yearly-vip').map((plan, index) => {
            // 根据用户的 buytype 和下载次数判断是否是当前套餐
            const isCurrentPlan = hasActiveMembership && (
              (plan.id === 'basic-monthly' && userProfile?.buytype === 1) ||
              (plan.id === 'pro-monthly' && userProfile?.buytype === 2 && userProfile?.value <= 5000) ||
              (plan.id === 'unlimited-monthly' && userProfile?.buytype === 2 && userProfile?.value > 5000)
            )
            // 基于套餐ID判断类型，而不是数组索引
            const isYearly = plan.id === 'unlimited-monthly' // 无限月度套餐作为年度超级VIP显示
            const isYearlyVIP = plan.id === 'pro-monthly' // 专业月度套餐作为一年VIP会员显示  
            const isMonthlyBasic = plan.id === 'basic-monthly' // 基础月度套餐作为一个月VIP会员显示
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
            } else if (isMonthlyBasic) {
              displayPrice = 28
              monthlyPrice = displayPrice
            } else {
              // 其他套餐使用数据库中的价格
              displayPrice = Math.round(plan.price)
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
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <h3 className={`text-xl font-bold ${(isYearly || isYearlyVIP) ? 'text-white' : 'text-gray-800'}`}>
                        {isYearly ? '年度超级VIP' : isYearlyVIP ? '一年 VIP会员' : isMonthlyBasic ? '一个月 VIP会员' : plan.name}
                      </h3>
                      {isYearly && (
                        <div className="bg-gradient-to-r from-yellow-300 to-yellow-500 text-purple-800 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg animate-pulse">
                          <Crown className="h-3 w-3" />
                          SVIP
                        </div>
                      )}
                    </div>
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
                  
                  {/* SVIP专属标识 */}
                  {isYearly && (
                    <div className="mb-4 flex justify-center">
                      <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-purple-900 px-4 py-2 rounded-xl shadow-lg border-2 border-yellow-300">
                        <div className="flex items-center gap-2">
                          <Crown className="h-5 w-5 text-purple-900" />
                          <span className="font-bold text-sm">超级VIP会员专享</span>
                          <Crown className="h-5 w-5 text-purple-900" />
                        </div>
                      </div>
                    </div>
                  )}
                  
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
                    
                    {isMonthlyBasic && (
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
                        <div className="text-center mb-4">
                          <div className="bg-gradient-to-r from-yellow-300/20 to-yellow-500/20 rounded-lg p-3 border border-yellow-300/30">
                            <div className="flex items-center justify-center gap-2 mb-1">
                              <Crown className="h-4 w-4 text-yellow-300" />
                              <span className="text-yellow-300 font-bold text-sm">SVIP超级会员特权</span>
                              <Crown className="h-4 w-4 text-yellow-300" />
                            </div>
                            <p className="text-white/90 text-xs">👥 已有3000+用户享受SVIP特权</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className={`flex items-center gap-3 p-2 rounded-lg ${isYearly ? 'bg-white/10 backdrop-blur-sm' : 'bg-gray-50'}`}>
                            <div className="w-8 h-8 bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-full flex items-center justify-center">
                              <Download className="h-4 w-4 text-purple-800" />
                            </div>
                            <span className="text-white text-sm">
                              <span className="inline-block bg-yellow-400 text-purple-800 text-xs px-1 rounded mr-2 font-bold">SVIP</span>
                              支持下载 图片/视频
                            </span>
                          </div>
                          <div className={`flex items-center gap-3 p-2 rounded-lg ${isYearly ? 'bg-white/10 backdrop-blur-sm' : 'bg-gray-50'}`}>
                            <div className="w-8 h-8 bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-full flex items-center justify-center">
                              <Zap className="h-4 w-4 text-purple-800" />
                            </div>
                            <span className="text-white text-sm">
                              <span className="inline-block bg-yellow-400 text-purple-800 text-xs px-1 rounded mr-2 font-bold">SVIP</span>
                              支持下载 多张图片/视频
                            </span>
                          </div>
                          <div className={`flex items-center gap-3 p-2 rounded-lg ${isYearly ? 'bg-white/10 backdrop-blur-sm' : 'bg-gray-50'}`}>
                            <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
                              <Crown className="h-4 w-4 text-orange-500" />
                            </div>
                            <span className="text-white text-sm">
                              <span className="text-yellow-300 font-bold">[新功能]</span> 网页端 一键打包下载功能
                            </span>
                          </div>
                          <div className={`flex items-center gap-3 p-2 rounded-lg ${isYearly ? 'bg-white/10 backdrop-blur-sm border border-yellow-300/30' : 'bg-gray-50'}`}>
                            <div className="w-8 h-8 bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-full flex items-center justify-center">
                              <Shield className="h-4 w-4 text-purple-800" />
                            </div>
                            <span className="text-white text-sm">
                              <span className="inline-block bg-yellow-400 text-purple-800 text-xs px-1 rounded mr-1 font-bold">SVIP专享</span>
                              <span className="text-green-300 font-bold">[新上线]</span> 批量下载指定博主帖子
                            </span>
                          </div>
                          <div className={`flex items-center gap-3 p-2 rounded-lg ${isYearly ? 'bg-white/10 backdrop-blur-sm border border-cyan-300/30' : 'bg-gray-50'}`}>
                            <div className="w-8 h-8 bg-gradient-to-r from-cyan-300 to-blue-400 rounded-full flex items-center justify-center">
                              <Timer className="h-4 w-4 text-purple-800" />
                            </div>
                            <span className="text-white text-sm">
                              <span className="inline-block bg-cyan-400 text-purple-800 text-xs px-1 rounded mr-1 font-bold">SVIP专享</span>
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
                    ) : isMonthlyBasic ? (
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
                    ) : (
                      // 其他套餐的默认功能列表
                      <div className="space-y-2">
                        <p className="text-center text-gray-600">暂无特定功能说明</p>
                      </div>
                    )}
                  </div>
                  
                  {/* 支付按钮 */}
                  {isCurrentPlan ? (
                    <div className="pt-4">
                      <Button
                        disabled={true}
                        className="w-full h-12 text-base font-semibold bg-gray-100 text-gray-500 cursor-not-allowed"
                      >
                        <Check className="h-5 w-5 mr-2" />
                        当前套餐
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3 pt-4">
                      <Button
                        onClick={() => handleUpgrade(plan.id, 'wechat')}
                        disabled={upgrading || isCreatingOrder || showGatewayPayment}
                        className={`w-full h-12 text-base font-semibold flex items-center justify-center gap-2 transition-all ${
                          (isYearly || isYearlyVIP)
                            ? 'bg-white/90 text-green-600 hover:bg-green-50'
                            : 'bg-green-500 hover:bg-green-600 text-white'
                        }`}
                      >
                        {(upgrading || isCreatingOrder) ? (
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
                        disabled={upgrading || isCreatingOrder || showGatewayPayment}
                        className={`w-full h-12 text-base font-semibold flex items-center justify-center gap-2 transition-all ${
                          (isYearly || isYearlyVIP)
                            ? 'bg-white text-blue-600 hover:bg-blue-50'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        {(upgrading || isCreatingOrder) ? (
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
      
      {/* 客服联系区域 */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <MessageCircle className="h-6 w-6 text-blue-600" />
            <h3 className="text-xl font-semibold text-gray-800">需要帮助？</h3>
          </div>
          
          <p className="text-gray-600 mb-4">
            如有支付问题或需要技术支持，请添加客服微信
          </p>
          
          <div className="flex items-center justify-center gap-4 bg-white rounded-lg p-4 border border-blue-200 max-w-md mx-auto">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-gray-700">微信号：</span>
              <span className="font-mono font-bold text-lg text-gray-900">popmarscom</span>
            </div>
          </div>
          
          <Button
            onClick={handleCopyWechat}
            variant={copied ? "outline" : "default"}
            size="sm"
            className="mx-auto"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                已复制微信号
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                复制微信号
              </>
            )}
          </Button>
          
          <div className="bg-blue-100 rounded-lg p-3 mt-4">
            <p className="text-sm text-blue-800">
              💡 复制微信号后，请在微信中添加好友联系客服
            </p>
          </div>
        </div>
      </div>
      
      {/* 新的支付网关弹窗 */}
      {selectedPlan && (
        <GatewayPaymentModal 
          isOpen={showGatewayPayment}
          onClose={() => {
            setShowGatewayPayment(false)
            setSelectedPlan(null)
            setSelectedPlanPrice(0)
          }}
          onPaymentSuccess={() => {
            // 支付成功后重新获取用户资料
            fetchUserProfile()
          }}
          planId={selectedPlan.id}
          planName={selectedPlan.name}
          planPrice={selectedPlanPrice}
          paymentMethod={selectedPaymentMethod}
          locale={locale}
        />
      )}
      </div>
    </div>
  )
}