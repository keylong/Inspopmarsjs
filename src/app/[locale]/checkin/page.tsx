'use client'

// 强制动态渲染，禁用静态生成
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, Gift, Calendar, TrendingUp, Star, Target, Award, Users, Sparkles } from 'lucide-react'
import { useI18n } from '@/lib/i18n/client'
import { CheckinCard } from '@/components/checkin/checkin-card'
import Link from 'next/link'

interface UserProfile {
  id: string
  name: string | null
  email: string
  value: number
}

export default function CheckinPage() {
  const t = useI18n()
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const params = useParams()
  const locale = params?.locale as string || 'zh-CN'
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  // 获取当前用户
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      
      if (!user) {
        // 未登录用户重定向到登录页
        const redirectPath = locale === 'zh-CN' ? '/checkin' : `/${locale}/checkin`
        const signupPath = locale === 'zh-CN' ? '/signup' : `/${locale}/signup`
        router.push(`${signupPath}?redirect=${redirectPath}`)
      }
    }
    getCurrentUser()
  }, [locale, router])

  // 获取用户资料
  useEffect(() => {
    if (user) {
      fetchUserProfile()
    }
  }, [user])

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/profile')
      if (response.ok) {
        const data = await response.json()
        setUserProfile(data.user)
      }
    } catch (error) {
      console.error('获取用户资料失败:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* 页面标题 */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          每日签到中心
        </h1>
        <p className="text-gray-600 text-lg">
          坚持签到，免费获取下载次数！
        </p>
      </div>

      {/* 签到统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">当前次数</p>
                <p className="text-2xl font-bold text-blue-700">{userProfile?.value || 0}</p>
              </div>
              <Gift className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">今日奖励</p>
                <p className="text-2xl font-bold text-green-700">+1-3次</p>
              </div>
              <Star className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">连续签到</p>
                <p className="text-2xl font-bold text-purple-700">额外奖励</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium">活跃用户</p>
                <p className="text-2xl font-bold text-orange-700">5000+</p>
              </div>
              <Users className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 签到主卡片 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* 左侧：签到功能 */}
        <div className="lg:col-span-2">
          <CheckinCard />
        </div>

        {/* 右侧：签到规则和福利 */}
        <div className="space-y-4">
          {/* 签到规则 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="h-5 w-5 text-blue-500" />
                签到规则
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-blue-500 font-bold">1.</span>
                <p className="text-sm text-gray-600">每日签到可获得1-3次下载机会</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-500 font-bold">2.</span>
                <p className="text-sm text-gray-600">连续签到有额外奖励</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-500 font-bold">3.</span>
                <p className="text-sm text-gray-600">签到获得的次数永久有效</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-500 font-bold">4.</span>
                <p className="text-sm text-gray-600">每天0点重置签到状态</p>
              </div>
            </CardContent>
          </Card>

          {/* 连续签到奖励 */}
          <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Award className="h-5 w-5 text-orange-500" />
                连续签到奖励
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-white rounded-lg">
                  <span className="text-sm font-medium">连续3天</span>
                  <Badge className="bg-blue-500">+2次额外</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded-lg">
                  <span className="text-sm font-medium">连续7天</span>
                  <Badge className="bg-purple-500">+5次额外</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded-lg">
                  <span className="text-sm font-medium">连续30天</span>
                  <Badge className="bg-gradient-to-r from-orange-500 to-red-500">+30次额外</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 升级提示 */}
          <Card className="bg-gradient-to-br from-purple-600 to-pink-600 text-white border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-white">
                <Sparkles className="h-5 w-5" />
                升级VIP
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-white/90">
                想要更多下载次数？升级VIP立享：
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-yellow-300">✓</span>
                  <span>月度会员500次/月</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-yellow-300">✓</span>
                  <span>年度会员5000次/年</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-yellow-300">✓</span>
                  <span>超级VIP无限下载</span>
                </li>
              </ul>
              <Link href={locale === 'zh-CN' ? '/subscription' : `/${locale}/subscription`}>
                <Button className="w-full bg-white text-purple-600 hover:bg-gray-100">
                  查看VIP套餐
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 底部提示 */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Gift className="h-12 w-12 text-blue-500 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">签到小贴士</h3>
              <p className="text-sm text-gray-600">
                每天记得来签到哦！连续签到不仅能获得更多奖励，还能养成良好的习惯。
                签到获得的次数永不过期，可以慢慢积累使用。
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}