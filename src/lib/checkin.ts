/**
 * 签到系统工具函数
 */

import { prisma } from '@/lib/prisma'

export interface CheckinRecord {
  id: string
  userId: string
  checkinDate: Date
  reward: number // 获得的下载次数
  consecutiveDays: number // 连续签到天数
  createdAt: Date
}

export interface CheckinStatus {
  hasCheckedToday: boolean
  todayReward: number
  consecutiveDays: number
  canCheckin: boolean
  nextRewardPreview: number
  totalRewards: number
}

// 签到奖励配置
const CHECKIN_REWARDS = {
  base: 3, // 基础签到奖励
  consecutive: {
    7: 5,   // 连续7天额外+2
    15: 10, // 连续15天额外+7
    30: 15  // 连续30天额外+12
  },
  maxDaily: 15 // 单日最大奖励
}

/**
 * 获取用户签到状态
 */
export async function getUserCheckinStatus(userId: string): Promise<CheckinStatus> {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  try {
    // 检查今天是否已签到
    const todayCheckin = await prisma.checkinRecord.findFirst({
      where: {
        userId,
        checkinDate: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        }
      }
    })

    // 获取最近的签到记录计算连续天数
    const recentCheckins = await prisma.checkinRecord.findMany({
      where: { userId },
      orderBy: { checkinDate: 'desc' },
      take: 50 // 最多查看最近50天
    })

    const consecutiveDays = calculateConsecutiveDays(recentCheckins, today)
    const nextReward = calculateReward(consecutiveDays + 1)

    // 计算总奖励
    const totalRewards = await prisma.checkinRecord.aggregate({
      where: { userId },
      _sum: { reward: true }
    })

    return {
      hasCheckedToday: !!todayCheckin,
      todayReward: todayCheckin?.reward || 0,
      consecutiveDays,
      canCheckin: !todayCheckin,
      nextRewardPreview: nextReward,
      totalRewards: totalRewards._sum.reward || 0
    }
  } catch (error) {
    console.error('获取签到状态失败:', error)
    return {
      hasCheckedToday: false,
      todayReward: 0,
      consecutiveDays: 0,
      canCheckin: true,
      nextRewardPreview: CHECKIN_REWARDS.base,
      totalRewards: 0
    }
  }
}

/**
 * 执行签到
 */
export async function performCheckin(userId: string): Promise<{
  success: boolean
  reward?: number
  consecutiveDays?: number
  message?: string
}> {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  try {
    // 检查今天是否已签到
    const existingCheckin = await prisma.checkinRecord.findFirst({
      where: {
        userId,
        checkinDate: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        }
      }
    })

    if (existingCheckin) {
      return {
        success: false,
        message: '今天已经签到过了，明天再来吧！'
      }
    }

    // 计算连续签到天数
    const recentCheckins = await prisma.checkinRecord.findMany({
      where: { userId },
      orderBy: { checkinDate: 'desc' },
      take: 50
    })

    const consecutiveDays = calculateConsecutiveDays(recentCheckins, today) + 1
    const reward = calculateReward(consecutiveDays)

    // 使用事务确保数据一致性
    const result = await prisma.$transaction(async (tx) => {
      // 创建签到记录
      const checkinRecord = await tx.checkinRecord.create({
        data: {
          userId,
          checkinDate: today,
          reward,
          consecutiveDays
        }
      })

      // 更新用户的下载次数
      await tx.user.update({
        where: { id: userId },
        data: {
          value: {
            increment: reward
          }
        }
      })

      return { checkinRecord, reward, consecutiveDays }
    })

    return {
      success: true,
      reward: result.reward,
      consecutiveDays: result.consecutiveDays,
      message: `签到成功！获得 ${result.reward} 次下载机会`
    }

  } catch (error) {
    console.error('签到失败:', error)
    return {
      success: false,
      message: '签到失败，请稍后重试'
    }
  }
}

/**
 * 计算连续签到天数
 */
function calculateConsecutiveDays(checkins: any[], today: Date): number {
  if (checkins.length === 0) return 0

  let consecutiveDays = 0
  const todayTime = today.getTime()

  for (let i = 0; i < checkins.length; i++) {
    const checkinDate = new Date(checkins[i].checkinDate)
    checkinDate.setHours(0, 0, 0, 0)
    
    const expectedDate = new Date(todayTime - (i + 1) * 24 * 60 * 60 * 1000)
    
    if (checkinDate.getTime() === expectedDate.getTime()) {
      consecutiveDays++
    } else {
      break
    }
  }

  return consecutiveDays
}

/**
 * 计算签到奖励
 */
function calculateReward(consecutiveDays: number): number {
  let reward = CHECKIN_REWARDS.base

  // 连续签到奖励
  for (const [days, bonus] of Object.entries(CHECKIN_REWARDS.consecutive)) {
    if (consecutiveDays >= parseInt(days)) {
      reward = CHECKIN_REWARDS.base + bonus
    }
  }

  return Math.min(reward, CHECKIN_REWARDS.maxDaily)
}

/**
 * 获取签到排行榜
 */
export async function getCheckinLeaderboard(limit = 10): Promise<Array<{
  userId: string
  userName: string
  consecutiveDays: number
  totalRewards: number
}>> {
  try {
    const leaderboard = await prisma.checkinRecord.groupBy({
      by: ['userId'],
      _max: {
        consecutiveDays: true
      },
      _sum: {
        reward: true
      },
      orderBy: {
        _max: {
          consecutiveDays: 'desc'
        }
      },
      take: limit
    })

    // 获取用户信息
    const userIds = leaderboard.map(item => item.userId)
    const users = await prisma.user.findMany({
      where: {
        id: {
          in: userIds
        }
      },
      select: {
        id: true,
        name: true
      }
    })

    return leaderboard.map(item => ({
      userId: item.userId,
      userName: users.find(u => u.id === item.userId)?.name || '匿名用户',
      consecutiveDays: item._max.consecutiveDays || 0,
      totalRewards: item._sum.reward || 0
    }))
  } catch (error) {
    console.error('获取签到排行榜失败:', error)
    return []
  }
}