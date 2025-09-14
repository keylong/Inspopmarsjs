/**
 * 会员状态管理工具函数
 */

export interface MembershipStatus {
  type: 'free' | 'active' | 'expired' | 'lifetime' | 'unknown';
  typeName: string;
  isActive: boolean;
  expiresAt: Date | null;
  daysRemaining: number | null;
}

/**
 * 计算会员状态
 * @param buytype 购买类型：0=免费，1=月度，2=年度，3=终身(已停售)
 * @param buydate 购买日期
 * @param value 下载次数，用于区分年度套餐类型
 * @returns 会员状态信息
 */
export function getMembershipStatus(buytype: number, buydate: Date | null, value?: number): MembershipStatus {
  if (buytype === 0) {
    return {
      type: 'free',
      typeName: '免费用户',
      isActive: false,
      expiresAt: null,
      daysRemaining: null
    }
  }

  // buytype = 3 表示无限时长会员，不需要校验 buydate
  if (buytype === 3) {
    return {
      type: 'lifetime',
      typeName: '终身会员',
      isActive: true,
      expiresAt: null,
      daysRemaining: null
    }
  }

  if (!buydate) {
    return {
      type: 'expired',
      typeName: '已过期',
      isActive: false,
      expiresAt: null,
      daysRemaining: 0
    }
  }

  // 计算到期时间
  const startDate = new Date(buydate)
  let expiresAt: Date
  let typeName: string

  if (buytype === 1) {
    // 月费：1个月有效
    expiresAt = new Date(startDate)
    expiresAt.setMonth(expiresAt.getMonth() + 1)
    typeName = '月度会员'
  } else if (buytype === 2) {
    // 年费：1年有效，根据下载次数区分套餐类型
    expiresAt = new Date(startDate)
    expiresAt.setFullYear(expiresAt.getFullYear() + 1)
    // 根据下载次数判断是哪种年度套餐
    if (value && value >= 999999) {
      typeName = '年度超级VIP' // 无限下载
    } else {
      typeName = '年度会员' // 5000次下载
    }
  } else {
    return {
      type: 'unknown',
      typeName: '未知类型',
      isActive: false,
      expiresAt: null,
      daysRemaining: null
    }
  }

  const now = new Date()
  const isActive = now < expiresAt
  const daysRemaining = Math.max(0, Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))

  return {
    type: isActive ? 'active' : 'expired',
    typeName,
    isActive,
    expiresAt,
    daysRemaining
  }
}

/**
 * 检查用户是否有有效会员权限
 * @param userProfile 用户资料
 * @returns 是否有权限 + 状态信息
 */
export function checkMembershipPermission(userProfile: any): {
  hasPermission: boolean;
  status: MembershipStatus;
  hasUsage: boolean;
} {
  if (!userProfile) {
    return {
      hasPermission: false,
      status: {
        type: 'free',
        typeName: '免费用户',
        isActive: false,
        expiresAt: null,
        daysRemaining: null
      },
      hasUsage: false
    }
  }

  const status = getMembershipStatus(userProfile.buytype, userProfile.buydate, userProfile.value)
  const hasUsage = userProfile.value > 0
  
  // 只有会员状态活跃且有剩余次数才有权限
  const hasPermission = status.isActive && hasUsage

  return {
    hasPermission,
    status,
    hasUsage
  }
}