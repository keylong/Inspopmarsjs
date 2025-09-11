'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  AlertTriangle, 
  Loader2,
  X 
} from 'lucide-react';
import { useToastStore } from '@/lib/hooks/use-toast';
import { cn } from '@/lib/utils';

const toastIcons = {
  success: CheckCircle,
  error: XCircle,
  info: AlertCircle,
  warning: AlertTriangle,
  loading: Loader2,
};

const toastStyles = {
  success: 'bg-green-50 border-green-200 text-green-900',
  error: 'bg-red-50 border-red-200 text-red-900',
  info: 'bg-blue-50 border-blue-200 text-blue-900',
  warning: 'bg-amber-50 border-amber-200 text-amber-900',
  loading: 'bg-gray-50 border-gray-200 text-gray-900',
};

const iconStyles = {
  success: 'text-green-600',
  error: 'text-red-600',
  info: 'text-blue-600',
  warning: 'text-amber-600',
  loading: 'text-gray-600',
};

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();
  
  // 调试日志
  console.log('🔔 ToastContainer - 当前 toasts 数量:', toasts.length, toasts);

  return (
    <div className="fixed top-4 right-4 z-50 pointer-events-none">
      <AnimatePresence mode="sync">
        {toasts.map((toast) => {
          const Icon = toastIcons[toast.type];
          
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 50, scale: 0.3 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
              className="pointer-events-auto mb-3"
            >
              <div
                className={cn(
                  'flex items-start gap-3 min-w-[300px] max-w-md p-4 rounded-lg border shadow-lg',
                  toastStyles[toast.type]
                )}
              >
                <div className={cn('flex-shrink-0 mt-0.5', iconStyles[toast.type])}>
                  <Icon 
                    className={cn(
                      'w-5 h-5',
                      toast.type === 'loading' && 'animate-spin'
                    )} 
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm">{toast.title}</h4>
                  {toast.description && (
                    <p className="mt-1 text-sm opacity-90">{toast.description}</p>
                  )}
                  
                  {toast.action && (
                    <button
                      onClick={toast.action.onClick}
                      className="mt-2 text-sm font-medium underline hover:no-underline"
                    >
                      {toast.action.label}
                    </button>
                  )}
                </div>
                
                {toast.type !== 'loading' && (
                  <button
                    onClick={() => removeToast(toast.id)}
                    className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}