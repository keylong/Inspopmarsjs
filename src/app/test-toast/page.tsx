'use client';

import { useToast } from '@/lib/hooks/use-toast';
import { Button } from '@/components/ui/button';

export default function TestToastPage() {
  const { toast, dismiss } = useToast();

  const handleTestToast = () => {
    console.log('🎯 Testing toast...');
    const id = toast.success('测试成功', '这是一个测试 Toast 消息');
    console.log('🎯 Toast ID:', id);
    
    setTimeout(() => {
      console.log('🎯 Adding warning toast...');
      toast.warning('警告消息', '这是一个警告消息');
    }, 1000);
    
    setTimeout(() => {
      console.log('🎯 Adding error toast...');
      toast.error('错误消息', '这是一个错误消息');
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-center">Toast 测试页面</h1>
        <div className="space-x-4">
          <Button onClick={handleTestToast}>
            测试 Toast
          </Button>
          <Button 
            variant="outline" 
            onClick={() => {
              const id = toast.loading('加载中', '正在处理...');
              setTimeout(() => {
                dismiss(id);
                toast.success('完成', '处理完成');
              }, 3000);
            }}
          >
            测试加载 Toast
          </Button>
        </div>
      </div>
    </div>
  );
}