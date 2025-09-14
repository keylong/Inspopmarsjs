'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, Clock, UserPlus, LogIn, Crown, Zap, Download, Image as ImageIcon, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface IPLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  remainingHours?: number;
  onRegister: () => void;
  onLogin: () => void;
}

export function IPLimitModal({ 
  isOpen, 
  onClose, 
  remainingHours = 24, 
  onRegister, 
  onLogin 
}: IPLimitModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          transition={{ 
            type: "spring", 
            damping: 25, 
            stiffness: 300,
            duration: 0.4
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* 关闭按钮 */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>

          {/* 头部渐变背景 */}
          <div className="relative bg-gradient-to-br from-orange-400 via-red-400 to-pink-500 px-6 pt-8 pb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-400/90 to-pink-500/90" />
            <div className="relative text-center">
              <motion.div
                className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <AlertCircle className="w-8 h-8 text-white" />
              </motion.div>
              
              <motion.h2 
                className="text-2xl font-bold text-white mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                今日下载次数已用完
              </motion.h2>
              
              <motion.p 
                className="text-white/90 text-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                未注册用户每日最多下载 1 次
              </motion.p>
            </div>
          </div>

          {/* 主要内容区域 */}
          <div className="p-6">
            {/* 重置时间提示 */}
            <motion.div 
              className="flex items-center justify-center gap-2 mb-6 p-3 bg-orange-50 rounded-lg border border-orange-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <Clock className="w-4 h-4 text-orange-600" />
              <span className="text-orange-700 text-sm font-medium">
                {remainingHours} 小时后重置下载次数
              </span>
            </motion.div>

            {/* VIP特权展示 */}
            <motion.div 
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Crown className="w-5 h-5 text-yellow-500" />
                <h3 className="text-lg font-bold text-gray-800">升级VIP会员，立享特权</h3>
                <Sparkles className="w-4 h-4 text-yellow-500" />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <motion.div 
                  className="flex items-center gap-2 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Zap className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-800 text-sm">秒速下载</p>
                    <p className="text-xs text-gray-600">无任何等待</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-center gap-2 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <ImageIcon className="w-4 h-4 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-800 text-sm">原图画质</p>
                    <p className="text-xs text-gray-600">最高分辨率</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-center gap-2 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Download className="w-4 h-4 text-purple-600" />
                  <div>
                    <p className="font-medium text-gray-800 text-sm">无限下载</p>
                    <p className="text-xs text-gray-600">500次/月</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-center gap-2 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Crown className="w-4 h-4 text-yellow-600" />
                  <div>
                    <p className="font-medium text-gray-800 text-sm">专属服务</p>
                    <p className="text-xs text-gray-600">优先支持</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* 限时优惠 */}
            <motion.div 
              className="mb-6 p-4 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg border-2 border-yellow-300"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <div className="text-center">
                <p className="text-lg font-bold text-orange-800 mb-1">
                  🎉 限时特惠
                </p>
                <p className="text-sm text-orange-700">
                  首月仅需 <span className="text-xl font-bold text-red-600">¥9.9</span>
                  <span className="text-xs text-gray-500 line-through ml-2">原价 ¥29.9</span>
                </p>
                <p className="text-xs text-orange-600 mt-1">立省 ¥20，限时优惠即将结束！</p>
              </div>
            </motion.div>

            {/* 操作按钮 */}
            <motion.div 
              className="flex gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <Button
                onClick={onRegister}
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                size="lg"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                立即注册VIP
              </Button>
              
              <Button
                onClick={onLogin}
                variant="outline"
                className="flex-1 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
                size="lg"
              >
                <LogIn className="w-4 h-4 mr-2" />
                已有账户？登录
              </Button>
            </motion.div>

            {/* 底部提示 */}
            <motion.div 
              className="mt-4 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
              <p className="text-xs text-gray-500">
                无风险承诺：7天内不满意可退款 | 支持微信/支付宝
              </p>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}