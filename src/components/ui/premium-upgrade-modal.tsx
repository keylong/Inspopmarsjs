'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Crown, Star, Zap, Shield, Download, ArrowRight, Timer } from 'lucide-react';
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

            {/* 内容区域 */}
            <div className="relative p-8 text-center">
              {/* VIP图标 */}
              <motion.div
                className="flex justify-center mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
              >
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                    <Crown className="w-8 h-8 text-white" />
                  </div>
                  <motion.div
                    className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Star className="w-3 h-3 text-white" />
                  </motion.div>
                </div>
              </motion.div>

              {/* 标题 */}
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                解锁原图画质
              </h2>
              <p className="text-gray-600 mb-6">
                升级至VIP会员，享受无限制图下载
              </p>

              {/* 功能特色 */}
              <div className="space-y-4 mb-8">
                <motion.div
                  className="flex items-center gap-3 p-3 bg-white/80 rounded-lg border border-gray-100"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Download className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">原图画质下载</p>
                    <p className="text-sm text-gray-500">获得高清分辨率图片</p>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-center gap-3 p-3 bg-white/80 rounded-lg border border-gray-100"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Zap className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">无限下载次数</p>
                    <p className="text-sm text-gray-500">不再受限制约束</p>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-center gap-3 p-3 bg-white/80 rounded-lg border border-gray-100"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Shield className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">优先支持</p>
                    <p className="text-sm text-gray-500">专属客服优先处理</p>
                  </div>
                </motion.div>
              </div>

              {/* 操作按钮 */}
              <div className="space-y-3">
                <Button
                  onClick={() => {
                    onClose();
                    // 跳转到订阅页面
                    window.location.href = '/subscription';
                  }}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-3 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
                  size="lg"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  立即注册成为VIP
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>

                <Button
                  variant="outline"
                  onClick={onLogin}
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-xl transition-all duration-300"
                  size="lg"
                >
                  已有账户？立即登录
                </Button>
              </div>

              {/* 底部提示 */}
              <div className="mt-6 p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-200">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Timer className="w-5 h-5 text-red-600" />
                    <span className="font-bold text-red-800 text-lg">🔥 限时优惠进行中！</span>
                  </div>
                  
                  <div className="flex justify-center gap-2 mb-3">
                    <div className="bg-red-600 text-white rounded-lg px-3 py-2 min-w-[50px] text-center">
                      <div className="text-xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</div>
                      <div className="text-xs">小时</div>
                    </div>
                    <div className="bg-red-600 text-white rounded-lg px-3 py-2 min-w-[50px] text-center">
                      <div className="text-xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</div>
                      <div className="text-xs">分钟</div>
                    </div>
                    <div className="bg-red-600 text-white rounded-lg px-3 py-2 min-w-[50px] text-center">
                      <div className="text-xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</div>
                      <div className="text-xs">秒</div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-red-800">
                    <span className="font-medium">💰 限时优惠：</span>
                    新用户首次开通VIP会员¥9.9，立省¥18.1
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}