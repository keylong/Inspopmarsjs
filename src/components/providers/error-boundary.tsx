'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import * as Sentry from '@sentry/nextjs';
import { trackError } from '@/lib/analytics';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // 更新 state，下次渲染时显示错误 UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 记录错误信息
    this.setState({
      error,
      errorInfo,
    });
    
    // 发送到 Sentry
    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
      },
    });
    
    // 发送到分析系统
    trackError(error.message, 'ErrorBoundary');
    
    // 发送到错误报告 API
    this.reportError(error, errorInfo);
  }

  private async reportError(error: Error, errorInfo: ErrorInfo) {
    try {
      await fetch('/api/monitoring/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: error.message,
          stack: error.stack,
          url: window.location.href,
          userAgent: navigator.userAgent,
          context: {
            componentStack: errorInfo.componentStack,
            errorBoundary: true,
          },
        }),
      });
    } catch (reportError) {
      console.error('Failed to report error:', reportError);
    }
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      // 使用自定义错误 UI 或默认错误 UI
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md mx-auto text-center">
            <div className="mb-4">
              <svg
                className="mx-auto h-12 w-12 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">出错了</h1>
            <p className="text-gray-600 mb-6">
              应用程序遇到了意外错误。我们已经收到了错误报告，正在处理这个问题。
            </p>
            
            <div className="space-y-3">
              <button
                onClick={this.handleRetry}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                重试
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
              >
                刷新页面
              </button>
            </div>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  查看错误详情 (仅开发环境)
                </summary>
                <div className="mt-2 p-3 bg-gray-100 rounded text-xs font-mono overflow-auto">
                  <p className="font-bold text-red-600">{this.state.error.message}</p>
                  {this.state.error.stack && (
                    <pre className="mt-2 whitespace-pre-wrap">
                      {this.state.error.stack}
                    </pre>
                  )}
                  {this.state.errorInfo?.componentStack && (
                    <details className="mt-2">
                      <summary className="cursor-pointer">Component Stack</summary>
                      <pre className="mt-1 whitespace-pre-wrap">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook 版本的错误边界 (用于函数组件)
export function useErrorHandler() {
  return (error: Error, errorInfo?: any) => {
    // 发送到 Sentry
    Sentry.captureException(error, {
      extra: errorInfo,
    });
    
    // 发送到分析系统
    trackError(error.message, 'useErrorHandler');
    
    // 发送到错误报告 API
    fetch('/api/monitoring/errors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: error.message,
        stack: error.stack,
        url: window.location.href,
        userAgent: navigator.userAgent,
        context: {
          ...errorInfo,
          handlerType: 'useErrorHandler',
        },
      }),
    }).catch(reportError => {
      console.error('Failed to report error:', reportError);
    });
  };
}