'use client';

import { useToast } from '@/lib/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { useToastStore } from '@/lib/hooks/use-toast';

export default function TestToastPage() {
  const { toast, dismiss } = useToast();
  const toasts = useToastStore((state) => state.toasts);

  const handleTestToast = () => {
    console.log('🎯 点击测试按钮');
    const id = toast.success('测试成功', '这是一个测试 Toast 消息');
    console.log('🎯 创建的 Toast ID:', id);
    console.log('🎯 当前 toasts 数组:', toasts);
    
    setTimeout(() => {
      console.log('🎯 添加警告 toast...');
      toast.warning('警告消息', '这是一个警告消息');
    }, 1000);
    
    setTimeout(() => {
      console.log('🎯 添加错误 toast...');
      toast.error('错误消息', '这是一个错误消息');
    }, 2000);
  };

  const handleLoadingTest = () => {
    console.log('🎯 测试加载 Toast');
    const id = toast.loading('加载中', '正在处理...');
    console.log('🎯 Loading Toast ID:', id);
    
    setTimeout(() => {
      console.log('🎯 关闭加载 Toast:', id);
      dismiss(id);
      toast.success('完成', '处理完成');
    }, 3000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-center">Toast 测试页面</h1>
        <p className="text-center text-gray-600">
          当前 Toasts 数量: {toasts.length}
        </p>
        <div className="space-x-4">
          <Button onClick={handleTestToast}>
            测试 Toast
          </Button>
          <Button 
            variant="outline" 
            onClick={handleLoadingTest}
          >
            测试加载 Toast
          </Button>
        </div>
        
        {/* 显示当前的 toasts */}
        {toasts.length > 0 && (
          <div className="mt-4 p-4 bg-white rounded-lg shadow">
            <h3 className="font-semibold mb-2">当前 Toasts:</h3>
            <ul className="space-y-1">
              {toasts.map(toast => (
                <li key={toast.id} className="text-sm">
                  [{toast.type}] {toast.title} - {toast.description}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}