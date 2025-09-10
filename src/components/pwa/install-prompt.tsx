'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, Download, Smartphone, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // 检查是否已经安装
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // 检查是否是iOS设备
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // 延迟显示提示，避免立即打扰用户
      setTimeout(() => {
        // 检查是否已经显示过提示
        const hasShownPrompt = localStorage.getItem('pwa-prompt-shown');
        const lastShownTime = localStorage.getItem('pwa-prompt-time');
        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;
        
        // 如果从未显示过，或者距离上次显示超过1天，则显示提示
        if (!hasShownPrompt || (lastShownTime && now - parseInt(lastShownTime) > oneDay)) {
          setShowPrompt(true);
          localStorage.setItem('pwa-prompt-shown', 'true');
          localStorage.setItem('pwa-prompt-time', now.toString());
        }
      }, 5000); // 5秒后显示
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // iOS特殊处理
    if (isIOS && !isInstalled) {
      setTimeout(() => {
        const hasShownIOSPrompt = localStorage.getItem('ios-pwa-prompt-shown');
        if (!hasShownIOSPrompt) {
          setShowPrompt(true);
          localStorage.setItem('ios-pwa-prompt-shown', 'true');
        }
      }, 10000); // iOS用户10秒后提示
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // iOS设备的特殊处理
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
      if (isIOS) {
        alert('请点击Safari浏览器底部的"分享"按钮，然后选择"添加到主屏幕"');
      }
      return;
    }

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('用户接受了PWA安装');
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 5000);
      } else {
        console.log('用户拒绝了PWA安装');
      }
    } catch (error) {
      console.error('安装PWA时出错:', error);
    } finally {
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // 记录用户拒绝的时间，下次延长显示间隔
    localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
  };

  return (
    <>
      {/* 安装提示弹窗 */}
      <AnimatePresence>
        {showPrompt && !isInstalled && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:w-96 z-50"
          >
            <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 shadow-xl">
              <button
                onClick={handleDismiss}
                className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/20 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/20 rounded-full">
                  <Smartphone className="h-6 w-6" />
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-2">
                    安装应用，体验更佳！
                  </h3>
                  <p className="text-sm text-white/90 mb-4">
                    将Instagram下载器添加到主屏幕，享受原生应用般的体验
                  </p>
                  
                  <div className="flex gap-3">
                    <Button
                      onClick={handleInstallClick}
                      className="bg-white text-purple-600 hover:bg-white/90 font-semibold"
                      size="sm"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      立即安装
                    </Button>
                    <Button
                      onClick={handleDismiss}
                      variant="ghost"
                      className="text-white hover:bg-white/20"
                      size="sm"
                    >
                      稍后再说
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 成功安装提示 */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="bg-green-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2">
              <Check className="h-5 w-5" />
              <span className="font-semibold">应用安装成功！</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 浮动安装按钮（仅在有安装权限但未安装时显示） */}
      {deferredPrompt && !isInstalled && !showPrompt && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowPrompt(true)}
          className="fixed bottom-6 right-6 p-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full shadow-lg z-40 hover:shadow-xl transition-shadow"
        >
          <Download className="h-6 w-6" />
        </motion.button>
      )}
    </>
  );
}