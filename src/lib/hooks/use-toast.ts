'use client';

import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'info' | 'warning' | 'loading';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastStore {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => string;
  removeToast: (id: string) => void;
  updateToast: (id: string, updates: Partial<Toast>) => void;
  clearToasts: () => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  
  addToast: (toast) => {
    const id = Math.random().toString(36).substring(2, 11);
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration ?? (toast.type === 'loading' ? 0 : 4000),
    };
    
    console.log('🔔 Adding toast to store:', newToast);
    
    set((state) => {
      const newToasts = [...state.toasts, newToast];
      console.log('🔔 Updated toasts array:', newToasts);
      return { toasts: newToasts };
    });
    
    // 自动移除非加载状态的 toast
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, newToast.duration);
    }
    
    return id;
  },
  
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },
  
  updateToast: (id, updates) => {
    set((state) => ({
      toasts: state.toasts.map((t) =>
        t.id === id ? { ...t, ...updates } : t
      ),
    }));
  },
  
  clearToasts: () => {
    set({ toasts: [] });
  },
}));

// 简化的 hook 接口
export function useToast() {
  const { addToast, removeToast, updateToast, clearToasts } = useToastStore();
  
  // 添加调试日志
  const logAndAdd = (toast: Omit<Toast, 'id'>) => {
    console.log('🎯 Adding toast:', toast);
    return addToast(toast);
  };
  
  return {
    toast: {
      success: (title: string, description?: string) =>
        logAndAdd({ type: 'success', title, description }),
      
      error: (title: string, description?: string) =>
        logAndAdd({ type: 'error', title, description }),
      
      info: (title: string, description?: string) =>
        logAndAdd({ type: 'info', title, description }),
      
      warning: (title: string, description?: string) =>
        logAndAdd({ type: 'warning', title, description }),
      
      loading: (title: string, description?: string) =>
        logAndAdd({ type: 'loading', title, description, duration: 0 }),
      
      custom: (toast: Omit<Toast, 'id'>) => logAndAdd(toast),
      
      dismiss: (id: string) => {
        console.log('🎯 Dismissing toast:', id);
        removeToast(id);
      },
    },
    
    dismiss: removeToast,
    update: updateToast,
    dismissAll: clearToasts,
  };
}