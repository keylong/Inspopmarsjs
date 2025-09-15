'use client'


import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Loader2, Calendar, Download, Check, Crown, Timer, Zap, Shield, MessageCircle, Copy, Star } from 'lucide-react'
import { WechatPayIcon, AlipayIcon } from '@/components/payment-icons'
import { SubscriptionPlan } from '@/types/payment'
import { useI18n } from '@/lib/i18n/client'
import { GatewayPaymentModal } from '@/components/gateway-payment-modal'
import { MembershipStatus } from '@/lib/membership'

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
  const [user, setUser] = useState<{ id: string; email: string } | null>(null)
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
      if (user && user.email) {
        setUser({ id: user.id, email: user.email })
      } else {
        setUser(null)
      }
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
    } catch {
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
      } catch (fallbackErr) {
        console.error('复制失败:', fallbackErr)
      }
      document.body.removeChild(textArea)
    }
  }

  const fetchUserProfile = useCallback(async () => {
    try {
      const response = await fetch('/api/profile')
      const result = await response.json()
      
      if (result.user) {
        setUserProfile(result.user)
      }
    } catch (err) {
      console.error('获取用户资料失败:', err)
    }
  }, [])

  const fetchPlans = useCallback(async () => {
    try {
      const response = await fetch('/api/payment/plans')
      const result = await response.json()
      
      if (result.success) {
        setPlans(result.data)
      }
    } catch (err) {
      console.error(t('subscription.errors.plansFetchFailed'), err)
    } finally {
      setLoading(false)
    }
  }, [t])

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
    } catch (err) {
      console.error(t('subscription.errors.checkoutFailed'), err)
      alert(t('subscription.errors.retryLater'))
    } finally {
      setUpgrading(false)
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
      ) : null}

      {/* 限时优惠提醒 - 仅未订阅用户显示 */}
      {!hasActiveMembership && (
        <div className="mb-6">
          <Card className="bg-gradient-to-r from-red-600 to-orange-600 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                    <Zap className="h-6 w-6 text-yellow-300" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">🔥 限时特惠进行中！</p>
                    <p className="text-sm text-white/90">新用户专享，年度SVIP立减270元，仅限今日！</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2">
                  <Timer className="h-4 w-4 text-yellow-300" />
                  <div className="flex gap-1 text-sm font-mono font-bold">
                    <span>{String(timeLeft.hours).padStart(2, '0')}</span>
                    <span>:</span>
                    <span>{String(timeLeft.minutes).padStart(2, '0')}</span>
                    <span>:</span>
                    <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 免费用户引导 */}
      {!hasActiveMembership && (
        <div className="mb-6 text-center">
          <p className="text-gray-600 mb-2">还在犹豫？</p>
          <p className="text-sm text-gray-500">
            我们也提供免费下载次数，
            <a href={`/${locale}/checkin`} className="text-blue-600 hover:underline font-medium">
              点击这里每日签到
            </a>
            即可获得
          </p>
        </div>
      )}

      {/* 套餐选择 - 新设计 */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-2">
            {hasActiveMembership ? '升级套餐' : '选择您的VIP套餐'}
          </h2>
          <p className="text-gray-600">
            超过<span className="text-orange-600 font-bold">10,000+</span>用户的选择，立即加入他们
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.filter(plan => plan.id !== 'yearly-vip').map((plan) => {
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
            
            // 设置不同套餐的价格
            let displayPrice = 0
            let originalPrice = 0
            
            if (isYearly) {
              displayPrice = 398
              originalPrice = 668
            } else if (isYearlyVIP) {
              displayPrice = 188
              originalPrice = 268
            } else if (isMonthlyBasic) {
              displayPrice = 28
            } else {
              // 其他套餐使用数据库中的价格
              displayPrice = Math.round(plan.price)
            }
            
            return (
              <Card key={plan.id} className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl ${
                isCurrentPlan ? 'ring-2 ring-blue-500' : ''
              } ${isYearly ? 'bg-gradient-to-br from-purple-700 to-purple-900 text-white transform hover:scale-105 border-2 border-purple-500/30 shadow-xl' : 
                 isYearlyVIP ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white transform hover:scale-105 border-0' : 'bg-white border border-gray-200'}`}>
                
                {/* 角标 */}
                {isYearlyVIP && (
                  <div className="absolute -top-1 -right-1">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-4 py-2 rounded-bl-xl font-bold text-sm shadow-lg">
                      🔥 最受欢迎
                    </div>
                  </div>
                )}
                {isYearly && (
                  <div className="absolute -top-1 -right-1">
                    <div className="bg-gradient-to-r from-purple-700 to-purple-900 text-white px-4 py-2 rounded-bl-xl font-bold text-sm shadow-lg">
                      👑 尊贵SVIP
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
                        <Badge className="bg-gradient-to-r from-yellow-400 to-amber-500 text-purple-900 px-2 py-1">
                          <Crown className="h-3 w-3 mr-1" />
                          SVIP
                        </Badge>
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
                      <div className="bg-gradient-to-r from-yellow-400 to-amber-500 text-purple-900 px-4 py-2 rounded-lg shadow-md">
                        <div className="flex items-center gap-2">
                          <Crown className="h-4 w-4" />
                          <span className="font-bold text-sm">超级VIP会员专享</span>
                          <Crown className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* 价格展示 */}
                  <div className="mb-6">
                    {/* 年度套餐显示月均价格 */}
                    {(isYearly || isYearlyVIP) ? (
                      <>
                        <div className="flex flex-col items-center">
                          {/* 月均价格（主要显示） */}
                          <div className="flex items-baseline gap-1 mb-2">
                            <span className="text-xl text-white/70">¥</span>
                            <span className="text-5xl font-bold text-white">
                              {isYearly ? '33' : '16'}
                            </span>
                            <span className="text-lg text-white/90">/月</span>
                          </div>
                          
                          {/* 年度总价（次要显示） */}
                          <div className="flex items-center gap-2 mb-3">
                            {originalPrice > 0 ? (
                              <>
                                <span className="text-sm line-through text-white/50">¥{originalPrice}</span>
                                <span className="text-lg font-semibold text-white">¥{displayPrice}/年</span>
                              </>
                            ) : (
                              <span className="text-lg font-semibold text-white">¥{displayPrice}/年</span>
                            )}
                          </div>
                          
                          {/* 节省金额标签 */}
                          <div className="flex items-center gap-2">
                            {isYearly && (
                              <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 text-sm">
                                限时立减¥270
                              </Badge>
                            )}
                            {isYearlyVIP && (
                              <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 text-sm">
                                年付特惠 省¥80
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        {/* 使用说明 */}
                        {isYearly && (
                          <p className="text-white/90 text-sm mt-2 text-center font-medium">
                            ∞ 无限下载额度
                          </p>
                        )}
                        
                        {isYearlyVIP && (
                          <p className="text-white/90 text-sm mt-2 text-center font-medium">
                            5000次下载额度
                          </p>
                        )}
                      </>
                    ) : (
                      // 月度套餐保持原样
                      <>
                        <div className="flex items-baseline justify-center gap-1 mb-2">
                          <span className="text-lg text-gray-500">¥</span>
                          <span className="text-4xl font-bold text-gray-900">
                            {displayPrice}
                          </span>
                          <span className="text-lg text-gray-600">/月</span>
                        </div>
                        {isMonthlyBasic && (
                          <p className="text-gray-500 text-sm text-center">
                            500次下载额度
                          </p>
                        )}
                      </>
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
                          <div className="bg-purple-800/20 rounded-lg p-3 border border-purple-400/30">
                            <div className="flex items-center justify-center gap-2 mb-1">
                              <Crown className="h-4 w-4 text-yellow-400" />
                              <span className="text-yellow-400 font-bold text-sm">SVIP超级会员特权</span>
                              <Crown className="h-4 w-4 text-yellow-400" />
                            </div>
                            <p className="text-white/80 text-xs">👥 已有3000+用户享受SVIP特权</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className={`flex items-center gap-3 p-2 rounded-lg ${isYearly ? 'bg-purple-800/10 backdrop-blur-sm' : 'bg-gray-50'}`}>
                            <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full flex items-center justify-center">
                              <Download className="h-4 w-4 text-purple-900" />
                            </div>
                            <span className="text-white text-sm">
                              <Badge className="bg-yellow-400 text-purple-900 text-xs px-1.5 py-0 mr-2">SVIP</Badge>
                              支持下载 图片/视频
                            </span>
                          </div>
                          <div className={`flex items-center gap-3 p-2 rounded-lg ${isYearly ? 'bg-purple-800/10 backdrop-blur-sm' : 'bg-gray-50'}`}>
                            <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full flex items-center justify-center">
                              <Zap className="h-4 w-4 text-purple-900" />
                            </div>
                            <span className="text-white text-sm">
                              <Badge className="bg-yellow-400 text-purple-900 text-xs px-1.5 py-0 mr-2">SVIP</Badge>
                              无限下载 多张图片/视频
                            </span>
                          </div>
                          <div className={`flex items-center gap-3 p-2 rounded-lg ${isYearly ? 'bg-purple-800/10 backdrop-blur-sm' : 'bg-gray-50'}`}>
                            <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
                              <Crown className="h-4 w-4 text-amber-500" />
                            </div>
                            <span className="text-white text-sm">
                              <span className="text-yellow-400 font-bold">[独家]</span> 网页端 一键打包下载
                            </span>
                          </div>
                          <div className={`flex items-center gap-3 p-2 rounded-lg ${isYearly ? 'bg-purple-800/10 backdrop-blur-sm border border-yellow-400/20' : 'bg-gray-50'}`}>
                            <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full flex items-center justify-center">
                              <Shield className="h-4 w-4 text-purple-900" />
                            </div>
                            <span className="text-white text-sm">
                              <Badge className="bg-gradient-to-r from-yellow-400 to-amber-500 text-purple-900 text-xs px-1.5 py-0 mr-1">专享</Badge>
                              <span className="text-green-400 font-semibold">[热门]</span> 批量下载博主帖子
                            </span>
                          </div>
                          <div className={`flex items-center gap-3 p-2 rounded-lg ${isYearly ? 'bg-purple-800/10 backdrop-blur-sm border border-cyan-400/20' : 'bg-gray-50'}`}>
                            <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                              <Timer className="h-4 w-4 text-white" />
                            </div>
                            <span className="text-white text-sm">
                              <Badge className="bg-cyan-500 text-white text-xs px-1.5 py-0 mr-1">即将上线</Badge>
                              <span className="text-cyan-400 font-semibold">AI提升清晰度</span>
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
                        className={`w-full h-12 text-base font-semibold flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg ${
                          (isYearly || isYearlyVIP)
                            ? 'bg-white text-gray-800 border-2 border-green-500 hover:bg-green-50'
                            : 'bg-white text-gray-800 border-2 border-green-500 hover:bg-green-50'
                        }`}
                      >
                        {(upgrading || isCreatingOrder) ? (
                          <Loader2 className="h-5 w-5 animate-spin text-green-600" />
                        ) : (
                          <>
                            <WechatPayIcon className="h-5 w-5" />
                            <span className="font-medium text-gray-800">微信支付</span>
                          </>
                        )}
                      </Button>
                      
                      <Button
                        onClick={() => handleUpgrade(plan.id, 'alipay')}
                        disabled={upgrading || isCreatingOrder || showGatewayPayment}
                        className={`w-full h-12 text-base font-semibold flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg ${
                          (isYearly || isYearlyVIP)
                            ? 'bg-white text-gray-800 border-2 border-blue-500 hover:bg-blue-50'
                            : 'bg-white text-gray-800 border-2 border-blue-500 hover:bg-blue-50'
                        }`}
                      >
                        {(upgrading || isCreatingOrder) ? (
                          <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                        ) : (
                          <>
                            <AlipayIcon className="h-5 w-5" />
                            <span className="font-medium text-gray-800">支付宝</span>
                          </>
                        )}
                      </Button>
                      
                      <div className="flex items-center justify-center gap-2 mt-2">
                        <div className="flex items-center gap-1">
                          <Shield className="h-3 w-3 text-green-600" />
                          <span className="text-xs text-gray-600">100%安全支付</span>
                        </div>
                        <span className="text-xs text-gray-400">|</span>
                        <div className="flex items-center gap-1">
                          <Check className="h-3 w-3 text-blue-600" />
                          <span className="text-xs text-gray-600">即时开通</span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
      
      {/* 用户评价展示 */}
      <div className="mt-12">
        <h3 className="text-xl font-bold text-center mb-6">用户真实评价</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-yellow-50 to-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                ))}
              </div>
              <p className="text-sm text-gray-700 mb-2">
                &ldquo;超级VIP太值了！无限下载，再也不用担心次数不够用了。&rdquo;
              </p>
              <p className="text-xs text-gray-500">— 李先生，设计师</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                ))}
              </div>
              <p className="text-sm text-gray-700 mb-2">
                &ldquo;客服响应很快，支付很方便，下载速度也很给力！&rdquo;
              </p>
              <p className="text-xs text-gray-500">— 王女士，营销经理</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                ))}
              </div>
              <p className="text-sm text-gray-700 mb-2">
                &ldquo;年度会员性价比很高，一年5000次完全够用了。&rdquo;
              </p>
              <p className="text-xs text-gray-500">— 张同学，大学生</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 安全保障 */}
      <div className="mt-12">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-bold flex items-center justify-center gap-2">
                <Shield className="h-6 w-6 text-green-600" />
                100% 安全保障
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                  <p className="font-medium text-gray-800">即时开通</p>
                  <p className="text-xs text-gray-600">支付成功立即生效</p>
                </div>
                <div className="text-center">
                  <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                  <p className="font-medium text-gray-800">安全支付</p>
                  <p className="text-xs text-gray-600">官方支付通道保障</p>
                </div>
                <div className="text-center">
                  <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                    <MessageCircle className="h-6 w-6 text-purple-600" />
                  </div>
                  <p className="font-medium text-gray-800">售后保障</p>
                  <p className="text-xs text-gray-600">7×24小时客服支持</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 客服联系区域 */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200 mt-8">
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