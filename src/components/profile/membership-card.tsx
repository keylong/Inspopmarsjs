'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Crown, Download, Clock } from 'lucide-react'

interface MembershipData {
  membership?: {
    type: string
    typeName: string
    isActive: boolean
    daysRemaining: number | null
    expiresAt: string | null
  }
  value?: number
  buytype?: number
}

interface MembershipCardProps {
  data: MembershipData | null
  isLoading: boolean
  onUpgrade: () => void
}

export function MembershipCard({ data, isLoading, onUpgrade }: MembershipCardProps) {
  const [displayData, setDisplayData] = useState<MembershipData | null>(null)
  const [animationStep, setAnimationStep] = useState(0)

  // 逐步显示数据的动画效果
  useEffect(() => {
    if (!isLoading && data) {
      // 延迟显示不同部分的数据，创造逐步填充的效果
      const timer1 = setTimeout(() => {
        setDisplayData(prev => ({
          ...prev,
          membership: data.membership
        }))
        setAnimationStep(1)
      }, 300)

      const timer2 = setTimeout(() => {
        setDisplayData(prev => ({
          ...prev,
          value: data.value
        }))
        setAnimationStep(2)
      }, 600)

      const timer3 = setTimeout(() => {
        setDisplayData(data)
        setAnimationStep(3)
      }, 900)

      return () => {
        clearTimeout(timer1)
        clearTimeout(timer2)
        clearTimeout(timer3)
      }
    }
    return undefined
  }, [data, isLoading])

  // 获取会员状态显示的颜色和样式
  const getMembershipBadgeStyle = (membership: any) => {
    if (!membership || membership.type === 'free') {
      return 'bg-gray-100 text-gray-700'
    }
    if (membership.type === 'expired') {
      return 'bg-red-100 text-red-700'
    }
    if (membership.type === 'active') {
      // VIP会员特殊样式 (buytype >= 2)
      if (data?.buytype && data.buytype >= 2) {
        return 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border border-purple-200'
      }
      return 'bg-green-100 text-green-700'
    }
    return 'bg-gray-100 text-gray-700'
  }

  // 检查是否是VIP会员
  const isVip = data?.buytype && data.buytype >= 2 && data?.membership?.isActive

  // 格式化日期
  const formatDate = (date: string | null) => {
    if (!date) return '未设置'
    return new Date(date).toLocaleDateString('zh-CN')
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Crown className={`w-5 h-5 mr-2 ${isVip ? 'text-yellow-500 animate-pulse' : 'text-yellow-500'}`} />
          会员状态
        </CardTitle>
        <CardDescription>
          查看您的订阅状态和剩余权益
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* 主要会员状态 */}
          <div className={`flex items-center justify-between py-3 px-4 rounded-lg transition-all duration-500 ${
            isVip 
              ? 'bg-gradient-to-r from-purple-50 via-pink-50 to-yellow-50 border border-purple-200' 
              : 'bg-gradient-to-r from-blue-50 to-purple-50'
          }`}>
            <div className="flex items-center">
              <Crown className={`w-6 h-6 mr-3 transition-all duration-300 ${
                isVip ? 'text-purple-600 animate-pulse' : 'text-yellow-500'
              }`} />
              <div>
                <p className="font-medium text-gray-900">订阅类型</p>
                <p className="text-sm text-gray-600">当前会员等级</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isVip && animationStep >= 1 && (
                <Crown className="w-5 h-5 text-purple-600 animate-bounce" />
              )}
              {animationStep >= 1 ? (
                <span className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${getMembershipBadgeStyle(displayData?.membership)}`}>
                  {displayData?.membership?.typeName || '免费用户'}
                </span>
              ) : (
                <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse"></div>
              )}
            </div>
          </div>

          {/* 统计信息 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <Download className="w-5 h-5 mr-2 text-blue-500" />
                <span className="text-sm font-medium text-gray-700">剩余下载次数</span>
              </div>
              {animationStep >= 2 ? (
                <span className="text-lg font-bold text-blue-600 transition-all duration-300">
                  {displayData?.value || 0}
                </span>
              ) : (
                <div className="h-6 w-8 bg-gray-200 rounded animate-pulse"></div>
              )}
            </div>

            <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-green-500" />
                <span className="text-sm font-medium text-gray-700">剩余天数</span>
              </div>
              {animationStep >= 3 ? (
                <span className="text-lg font-bold text-green-600 transition-all duration-300">
                  {displayData?.membership?.daysRemaining !== null 
                    ? `${displayData?.membership?.daysRemaining} 天`
                    : '无限制'
                  }
                </span>
              ) : (
                <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
              )}
            </div>
          </div>

          {/* 到期时间 */}
          {displayData?.membership?.expiresAt && animationStep >= 3 && (
            <div className="pt-3 border-t border-gray-200 animate-fadeIn">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>到期时间</span>
                <span>{formatDate(displayData.membership.expiresAt)}</span>
              </div>
            </div>
          )}

          {/* 升级按钮 */}
          {displayData?.membership?.type === 'free' && animationStep >= 3 && (
            <div className="pt-3 border-t border-gray-200 animate-fadeIn">
              <Button 
                variant="default" 
                size="sm" 
                onClick={onUpgrade}
                className="w-full transition-all duration-300 hover:shadow-lg"
              >
                升级到会员
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}