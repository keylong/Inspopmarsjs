'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Calendar, 
  Gift, 
  Flame, 
  Star, 
  Trophy,
  Loader2,
  CheckCircle,
  Download
} from 'lucide-react'

interface CheckinStatus {
  hasCheckedToday: boolean
  todayReward: number
  consecutiveDays: number
  canCheckin: boolean
  nextRewardPreview: number
  totalRewards: number
}

export function CheckinCard() {
  const [status, setStatus] = useState<CheckinStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [checkinLoading, setCheckinLoading] = useState(false)

  useEffect(() => {
    fetchCheckinStatus()
  }, [])

  const fetchCheckinStatus = async () => {
    try {
      const response = await fetch('/api/checkin')
      const result = await response.json()
      
      if (result.success) {
        setStatus(result.data)
      }
    } catch (error) {
      console.error('获取签到状态失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCheckin = async () => {
    if (!status?.canCheckin) return
    
    setCheckinLoading(true)
    try {
      const response = await fetch('/api/checkin', {
        method: 'POST'
      })
      const result = await response.json()
      
      if (result.success) {
        // 刷新状态
        await fetchCheckinStatus()
        
        // 显示成功消息（可以用toast）
        alert(result.data.message)
      } else {
        alert(result.error || '签到失败')
      }
    } catch (error) {
      console.error('签到失败:', error)
      alert('签到失败，请稍后重试')
    } finally {
      setCheckinLoading(false)
    }
  }

  const getConsecutiveIcon = (days: number) => {
    if (days >= 30) return <Trophy className="h-4 w-4 text-yellow-500" />
    if (days >= 15) return <Star className="h-4 w-4 text-purple-500" />
    if (days >= 7) return <Flame className="h-4 w-4 text-orange-500" />
    return <Calendar className="h-4 w-4 text-blue-500" />
  }

  const getConsecutiveColor = (days: number) => {
    if (days >= 30) return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    if (days >= 15) return 'text-purple-600 bg-purple-50 border-purple-200'
    if (days >= 7) return 'text-orange-600 bg-orange-50 border-orange-200'
    return 'text-blue-600 bg-blue-50 border-blue-200'
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </CardContent>
      </Card>
    )
  }

  if (!status) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-gray-500">
          获取签到信息失败，请刷新页面
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-5 w-5" />
          每日签到
        </CardTitle>
        <CardDescription className="text-blue-100">
          坚持签到获取免费下载次数，连续签到奖励更丰厚！
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* 签到状态 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {status.hasCheckedToday ? (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">今日已签到</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-5 w-5" />
                  <span className="font-medium">今日未签到</span>
                </div>
              )}
            </div>
            
            {status.hasCheckedToday && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                +{status.todayReward} 次数
              </Badge>
            )}
          </div>

          {/* 连续签到天数 */}
          {status.consecutiveDays > 0 && (
            <div className={`flex items-center gap-3 p-3 rounded-lg border ${getConsecutiveColor(status.consecutiveDays)}`}>
              {getConsecutiveIcon(status.consecutiveDays)}
              <div>
                <div className="font-medium">连续签到 {status.consecutiveDays} 天</div>
                <div className="text-sm opacity-80">
                  {status.consecutiveDays >= 30 && '🏆 签到达人！'}
                  {status.consecutiveDays >= 15 && status.consecutiveDays < 30 && '⭐ 坚持不懈！'}
                  {status.consecutiveDays >= 7 && status.consecutiveDays < 15 && '🔥 连续一周！'}
                  {status.consecutiveDays < 7 && '继续坚持签到吧！'}
                </div>
              </div>
            </div>
          )}

          {/* 签到进度 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">签到进度</span>
              <span className="text-gray-600">{status.consecutiveDays}/30 天</span>
            </div>
            <Progress 
              value={(status.consecutiveDays % 30) / 30 * 100} 
              className="h-2"
            />
            <div className="text-xs text-gray-500 text-center">
              连续30天签到可获得最高奖励
            </div>
          </div>

          {/* 奖励预览 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">奖励统计</span>
              <div className="flex items-center gap-1 text-green-600">
                <Download className="h-4 w-4" />
                <span className="font-bold">{status.totalRewards}</span>
                <span className="text-sm">总获得</span>
              </div>
            </div>
            
            {!status.hasCheckedToday && (
              <div className="text-sm text-gray-600">
                明日签到可获得: <span className="font-medium text-blue-600">{status.nextRewardPreview} 次下载</span>
              </div>
            )}
          </div>

          {/* 签到按钮 */}
          <Button
            onClick={handleCheckin}
            disabled={!status.canCheckin || checkinLoading}
            className="w-full"
            size="lg"
          >
            {checkinLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {status.hasCheckedToday ? '今日已签到' : '立即签到'}
          </Button>

          {/* 签到说明 */}
          <div className="text-xs text-gray-500 bg-blue-50 rounded-lg p-3">
            <div className="font-medium text-blue-800 mb-1">签到规则：</div>
            <ul className="space-y-1 text-blue-700">
              <li>• 每日签到可获得 3 次免费下载</li>
              <li>• 连续 7 天: +2 次奖励 (共5次)</li>
              <li>• 连续 15 天: +7 次奖励 (共10次)</li>
              <li>• 连续 30 天: +12 次奖励 (共15次)</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}