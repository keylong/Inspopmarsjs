'use client';


import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  trackDownload, 
  trackUserAction, 
  trackError, 
  trackPerformance, 
  trackConversion,
  trackCustomEvent 
} from '@/lib/analytics';
import { useErrorHandler } from '@/components/providers/error-boundary';
import logger from '@/lib/logger';

export default function TestMonitoringPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const handleError = useErrorHandler();

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testAnalytics = () => {
    // 测试各种分析事件
    trackUserAction('test_button_click', { page: 'test-monitoring' });
    trackDownload('image', 'instagram', true);
    trackConversion('download_success');
    trackCustomEvent({ name: 'test_event', properties: { test: true } });
    addLog('Analytics events tracked');
  };

  const testError = () => {
    try {
      // 故意抛出错误来测试错误处理
      throw new Error('This is a test error for monitoring');
    } catch (error) {
      handleError(error as Error, { context: 'test_page', action: 'test_error_button' });
      trackError('Test error triggered', 'test_page');
      addLog('Error tracked and reported');
    }
  };

  const testPerformance = () => {
    const start = performance.now();
    
    // 模拟一些计算
    setTimeout(() => {
      const duration = performance.now() - start;
      trackPerformance('test_operation', duration);
      addLog(`Performance metric tracked: ${duration.toFixed(2)}ms`);
    }, Math.random() * 1000);
  };

  const testLogger = () => {
    logger.debug('Debug message from test page');
    logger.info('Info message', { userId: 'test-user', action: 'test_logger' });
    logger.warn('Warning message', { level: 'test' });
    logger.error('Error message', new Error('Test error'), { context: 'test_logger' });
    addLog('Various log levels tested');
  };

  const testAPICall = async () => {
    try {
      const start = performance.now();
      const response = await fetch('/api/monitoring/stats?timeRange=1h');
      const duration = performance.now() - start;
      
      logger.apiCall('GET', '/api/monitoring/stats', duration, response.status);
      
      if (response.ok) {
        const data = await response.json();
        addLog(`API call successful: ${data.totalDownloads} downloads`);
      } else {
        addLog(`API call failed with status: ${response.status}`);
      }
    } catch (error) {
      logger.error('API call failed', error as Error);
      addLog('API call error tracked');
    }
  };

  const testSecurityEvent = () => {
    logger.security('Test security event', {
      type: 'suspicious_activity',
      details: 'Multiple failed attempts',
      ip: '127.0.0.1',
    });
    addLog('Security event logged');
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">监控系统测试</h1>
        <p className="text-muted-foreground mt-2">
          测试分析追踪、错误报告、性能监控和日志记录功能
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* 测试按钮 */}
        <Card>
          <CardHeader>
            <CardTitle>功能测试</CardTitle>
            <CardDescription>点击按钮测试各种监控功能</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <button
              onClick={testAnalytics}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              测试 Analytics 追踪
            </button>
            
            <button
              onClick={testError}
              className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              测试错误处理
            </button>
            
            <button
              onClick={testPerformance}
              className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
            >
              测试性能监控
            </button>
            
            <button
              onClick={testLogger}
              className="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
            >
              测试日志记录
            </button>
            
            <button
              onClick={testAPICall}
              className="w-full bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition-colors"
            >
              测试 API 调用
            </button>
            
            <button
              onClick={testSecurityEvent}
              className="w-full bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition-colors"
            >
              测试安全事件
            </button>
          </CardContent>
        </Card>

        {/* 实时日志 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>实时日志</CardTitle>
              <CardDescription>测试操作的实时反馈</CardDescription>
            </div>
            <button
              onClick={clearLogs}
              className="text-sm bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 transition-colors"
            >
              清除日志
            </button>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-3 rounded max-h-60 overflow-y-auto">
              {logs.length === 0 ? (
                <p className="text-gray-500 text-sm">点击上方按钮开始测试...</p>
              ) : (
                <div className="space-y-1">
                  {logs.map((log, index) => (
                    <div key={index} className="text-sm font-mono text-gray-700">
                      {log}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 监控链接 */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>监控仪表板</CardTitle>
            <CardDescription>查看监控数据和系统状态</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-3">
              <a
                href="/zh-CN/monitoring"
                className="block bg-blue-50 border border-blue-200 rounded p-4 hover:bg-blue-100 transition-colors"
              >
                <h3 className="font-semibold text-blue-900">监控仪表板</h3>
                <p className="text-sm text-blue-700">查看实时系统监控数据</p>
              </a>
              
              <div className="bg-gray-50 border border-gray-200 rounded p-4">
                <h3 className="font-semibold text-gray-900">Sentry</h3>
                <p className="text-sm text-gray-700">外部错误追踪平台</p>
                <p className="text-xs text-gray-500 mt-1">需要配置 DSN</p>
              </div>
              
              <div className="bg-gray-50 border border-gray-200 rounded p-4">
                <h3 className="font-semibold text-gray-900">Vercel Analytics</h3>
                <p className="text-sm text-gray-700">用户行为分析</p>
                <p className="text-xs text-gray-500 mt-1">部署到 Vercel 后生效</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 使用说明 */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>使用说明</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <ul className="space-y-2 text-sm">
            <li><strong>Analytics 追踪:</strong> 测试用户行为、下载事件、转化事件追踪</li>
            <li><strong>错误处理:</strong> 测试客户端错误捕获和 Sentry 集成</li>
            <li><strong>性能监控:</strong> 测试性能指标收集和 Core Web Vitals</li>
            <li><strong>日志记录:</strong> 测试结构化日志记录和远程日志发送</li>
            <li><strong>API 调用:</strong> 测试 API 监控和响应时间追踪</li>
            <li><strong>安全事件:</strong> 测试安全相关事件的记录</li>
          </ul>
          
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-sm text-yellow-800">
              <strong>注意:</strong> 在生产环境中，请确保正确配置 Sentry DSN 和其他监控服务的 API 密钥。
              当前在开发环境中，部分功能可能只会在控制台显示，而不会发送到外部服务。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}