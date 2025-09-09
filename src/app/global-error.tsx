'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 报告全局错误到 Sentry
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md mx-auto text-center p-6">
            <div className="mb-4">
              <svg
                className="mx-auto h-16 w-16 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                />
              </svg>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              应用程序发生错误
            </h1>
            
            <p className="text-gray-600 mb-6">
              很抱歉，应用程序遇到了意外错误。我们已经收到了错误报告，正在处理这个问题。
            </p>
            
            <div className="space-y-3">
              <button
                onClick={() => reset()}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                重新尝试
              </button>
              
              <button
                onClick={() => window.location.href = '/'}
                className="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                返回首页
              </button>
            </div>
            
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 font-medium">
                  查看错误详情 (仅开发环境)
                </summary>
                <div className="mt-3 p-4 bg-red-50 rounded-lg border border-red-200">
                  <p className="font-mono text-sm text-red-800 font-semibold">
                    {error.message}
                  </p>
                  {error.stack && (
                    <pre className="mt-2 text-xs text-red-700 overflow-auto max-h-40">
                      {error.stack}
                    </pre>
                  )}
                  {error.digest && (
                    <p className="mt-2 text-xs text-red-600">
                      <span className="font-semibold">Digest:</span> {error.digest}
                    </p>
                  )}
                </div>
              </details>
            )}
            
            <div className="mt-8 text-xs text-gray-400">
              <p>如果问题持续存在，请联系技术支持</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}