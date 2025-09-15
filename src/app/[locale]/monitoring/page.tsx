import { Metadata } from 'next';
import dynamicComponent from 'next/dynamic';


// 动态导入监控仪表板组件以减少初始包大小
const MonitoringDashboard = dynamicComponent(
  () => import('@/components/monitoring/dashboard').then((mod) => ({ 
    default: mod.MonitoringDashboard 
  })),
  {
    loading: () => (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <span className="ml-2 text-gray-600">加载监控数据中...</span>
      </div>
    ),
  }
);

export const metadata: Metadata = {
  title: '监控仪表板 - Instagram 下载器',
  description: '实时监控系统状态、性能指标和错误报告',
};

// 强制动态渲染，禁用静态生成
export const dynamic = 'force-dynamic';

export default function MonitoringPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">监控仪表板</h1>
        <p className="text-muted-foreground mt-2">
          实时监控系统性能、用户活动和错误统计
        </p>
      </div>
      
      <MonitoringDashboard />
      
      <div className="mt-8 text-sm text-muted-foreground">
        <p>数据每30秒自动刷新 • 最后更新: {new Date().toLocaleString('zh-CN')}</p>
      </div>
    </div>
  );
}