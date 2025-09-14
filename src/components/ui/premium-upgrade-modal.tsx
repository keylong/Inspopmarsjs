'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Crown, Star, Zap, Shield, Download, ArrowRight, Timer, TrendingUp, Users, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/lib/i18n/client';

interface PremiumUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignUp: () => void;
  onLogin: () => void;
}

export function PremiumUpgradeModal({ isOpen, onClose, onSignUp, onLogin }: PremiumUpgradeModalProps) {
  const t = useI18n();
  
  // 倒计时状态
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  // 倒计时逻辑 - 24小时倒计时
  useEffect(() => {
    // 设定结束时间为当天晚上23:59:59
    const today = new Date();
    const endTime = new Date(today);
    endTime.setHours(23, 59, 59, 999);
    
    const updateCountdown = () => {
      const now = new Date();
      const timeDiff = endTime.getTime() - now.getTime();
      
      if (timeDiff > 0) {
        const hours = Math.floor(timeDiff / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
        
        setTimeLeft({ hours, minutes, seconds });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    };
    
    if (isOpen) {
      updateCountdown();
      const timer = setInterval(updateCountdown, 1000);
      
      return () => clearInterval(timer);
    }
    
    // 当模态框关闭时，返回空的清理函数
    return () => {};
  }, [isOpen]);
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 渐变背景 */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-indigo-500/10" />
            
            {/* 关闭按钮 */}
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 z-10 text-gray-500 hover:text-gray-700"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </Button>

            {/* 顶部状态栏 - 显示剩余次数 */}
            <div className="bg-gradient-to-r from-red-500 to-orange-500 px-6 py-3">
              <div className="flex items-center justify-center gap-2 text-white">
                <Sparkles className="w-5 h-5" />
                <span className="font-bold text-lg">下载次数不足！</span>
                <Sparkles className="w-5 h-5" />
              </div>
            </div>

            {/* 内容区域 */}
            <div className="relative p-6 text-center">
              {/* VIP图标 */}
              <motion.div
                className="flex justify-center mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
              >
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-xl">
                    <Crown className="w-10 h-10 text-white" />
                  </div>
                  <motion.div
                    className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-lg"
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <span className="text-white font-bold text-xs">HOT</span>
                  </motion.div>
                </div>
              </motion.div>

              {/* 标题 */}
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                立即解锁无限下载
              </h2>
              <p className="text-gray-600 mb-1">
                超过10,000+用户的选择
              </p>
              
              {/* 用户数量展示 */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <Users className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-600 font-medium">
                  当前在线：<span className="font-bold">3,258</span> 人
                </span>
              </div>

              {/* 价格对比卡片 */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 mb-4 border-2 border-purple-200">
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div className="text-center">
                    <p className="text-xs text-gray-600 mb-1">月度VIP</p>
                    <p className="text-lg font-bold text-gray-900">¥28</p>
                    <p className="text-xs text-gray-500">500次/月</p>
                  </div>
                  <div className="text-center relative">
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">最优惠</span>
                    </div>
                    <p className="text-xs text-gray-600 mb-1 mt-3">年度VIP</p>
                    <p className="text-lg font-bold text-purple-600">¥188</p>
                    <p className="text-xs text-gray-500">5000次/年</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600 mb-1">超级VIP</p>
                    <p className="text-lg font-bold text-gray-900">¥398</p>
                    <p className="text-xs text-gray-500">无限次/年</p>
                  </div>
                </div>
                
                {/* 优势列表 */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <Download className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-gray-700">原图画质下载，高清无水印</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <Zap className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-gray-700">极速下载，无需等待</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                      <Shield className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-gray-700">7×24小时专属客服</span>
                  </div>
                </div>
              </div>

              {/* 限时优惠倒计时 */}
              <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-xl p-3 mb-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Timer className="w-4 h-4 text-white animate-pulse" />
                  <span className="text-white font-bold">🔥 限时特惠进行中！</span>
                </div>
                <div className="flex justify-center gap-1">
                  <div className="bg-white/20 backdrop-blur rounded px-2 py-1 min-w-[40px] text-center">
                    <div className="text-lg font-bold text-white">{String(timeLeft.hours).padStart(2, '0')}</div>
                    <div className="text-xs text-white/80">小时</div>
                  </div>
                  <span className="text-white text-lg font-bold self-center">:</span>
                  <div className="bg-white/20 backdrop-blur rounded px-2 py-1 min-w-[40px] text-center">
                    <div className="text-lg font-bold text-white">{String(timeLeft.minutes).padStart(2, '0')}</div>
                    <div className="text-xs text-white/80">分钟</div>
                  </div>
                  <span className="text-white text-lg font-bold self-center">:</span>
                  <div className="bg-white/20 backdrop-blur rounded px-2 py-1 min-w-[40px] text-center">
                    <div className="text-lg font-bold text-white">{String(timeLeft.seconds).padStart(2, '0')}</div>
                    <div className="text-xs text-white/80">秒</div>
                  </div>
                </div>
                <p className="text-white text-sm mt-2 text-center">
                  <span className="font-bold">💎 年度超级VIP：</span>
                  原价¥668，现仅需¥398，立省¥270！
                </p>
              </div>

              {/* 操作按钮 */}
              <div className="space-y-2">
                <Button
                  onClick={() => {
                    onClose();
                    // 跳转到订阅页面
                    window.location.href = '/subscription';
                  }}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 rounded-xl shadow-xl transition-all duration-300 transform hover:scale-105 text-lg"
                  size="lg"
                >
                  <Crown className="w-5 h-5 mr-2" />
                  立即开通VIP会员
                  <ArrowRight className="w-5 h-5 ml-2 animate-pulse" />
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  已有账户？
                  <button 
                    onClick={onLogin}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    立即登录
                  </button>
                </p>
              </div>

              {/* 底部信任标识 */}
              <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  <span>安全支付</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>即时生效</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span>10000+用户</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}