// 优雅的错误处理工具函数
// 使用您现有的Zustand Toast系统

interface ErrorResponse {
  success: boolean;
  error?: string;
  needsUpgrade?: boolean;
  ipLimited?: boolean;
  membershipStatus?: {
    type: string;
    typeName: string;
    isActive: boolean;
  };
  meta?: {
    membershipExpired?: boolean;
    remainingUsage?: number;
  };
}

interface ErrorHandlerOptions {
  isAuthenticated: boolean;
  toast: any; // Toast函数
  onUpgrade?: () => void;
  onLogin?: () => void;
  onRegister?: () => void;
}

/**
 * 处理下载错误的工具函数
 */
export function handleDownloadError(
  response: ErrorResponse, 
  options: ErrorHandlerOptions
): boolean {
  if (response.success) return true;

  const { toast, isAuthenticated, onUpgrade, onLogin, onRegister } = options;

  // 会员过期错误 - 最高优先级
  if (response.needsUpgrade && response.meta?.membershipExpired) {
    const membershipName = response.membershipStatus?.typeName || '会员';
    
    toast.error(
      '会员已过期', 
      `您的${membershipName}已到期，请续费后继续享受高品质下载服务`
    );
    
    // 延迟显示升级按钮
    setTimeout(() => {
      if (onUpgrade) onUpgrade();
    }, 1000);
    
    return false;
  }

  // 下载次数不足错误
  if (response.needsUpgrade && !response.meta?.membershipExpired) {
    const remainingUsage = response.meta?.remainingUsage || 0;
    
    toast.error(
      '下载次数不足',
      `剩余 ${remainingUsage} 次下载，升级VIP享受无限制下载`
    );
    
    setTimeout(() => {
      if (onUpgrade) onUpgrade();
    }, 1000);
    
    return false;
  }

  // IP限制错误
  if (response.ipLimited) {
    toast.error(
      '今日下载已达上限',
      '免费用户每日限制3次下载，注册登录获得更多权益'
    );
    
    setTimeout(() => {
      if (!isAuthenticated && onRegister) {
        onRegister();
      }
    }, 1000);
    
    return false;
  }

  // 一般错误
  toast.error('下载失败', response.error || '请稍后重试或联系客服');
  return false;
}

/**
 * 显示成功提示
 */
export function showSuccessToast(toast: any, message?: string, extraInfo?: string) {
  toast.success('下载成功', message || '内容已准备就绪，请查看下载链接');

  // 如果有额外信息（比如扣费提醒），延迟显示
  if (extraInfo) {
    setTimeout(() => {
      toast.info('使用提醒', extraInfo);
    }, 1500);
  }
}

/**
 * 智能建议系统
 */
export function showSmartSuggestion(
  toast: any,
  userBehavior: {
    downloadCount: number;
    isFrequentUser: boolean;
    lastUpgradePrompt: Date | null;
  }
) {
  // 如果是频繁用户但还没升级过，给出智能建议
  if (userBehavior.isFrequentUser && userBehavior.downloadCount > 10) {
    const daysSinceLastPrompt = userBehavior.lastUpgradePrompt 
      ? (Date.now() - userBehavior.lastUpgradePrompt.getTime()) / (1000 * 60 * 60 * 24)
      : 999;

    if (daysSinceLastPrompt > 3) { // 3天内不重复提示
      setTimeout(() => {
        toast.info(
          '贴心建议', 
          '看起来您经常使用我们的服务，升级VIP可节省更多时间哦~'
        );
      }, 2000);
    }
  }
}

/**
 * 创建错误处理器的便捷函数
 */
export function createErrorHandler(
  toast: any,
  isAuthenticated: boolean,
  onUpgrade: () => void,
  onLogin: () => void,
  onRegister: () => void
) {
  return {
    handleError: (response: ErrorResponse) => 
      handleDownloadError(response, {
        toast,
        isAuthenticated,
        onUpgrade,
        onLogin,
        onRegister,
      }),
    
    showSuccess: (message?: string, extraInfo?: string) =>
      showSuccessToast(toast, message, extraInfo),
      
    showSuggestion: (userBehavior: any) =>
      showSmartSuggestion(toast, userBehavior),
  };
}