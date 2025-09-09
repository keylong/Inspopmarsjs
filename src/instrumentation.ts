export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // 服务器端 Sentry 配置
    const Sentry = await import('@sentry/nextjs');
    
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      
      // Define how likely traces are sampled. Adjust this value in production.
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      
      // Setting this option to true will print useful information to the console while you're setting up Sentry.
      debug: process.env.NODE_ENV === 'development',

      // Additional configuration
      environment: process.env.NODE_ENV || 'development',

      // Server-side specific configuration
      serverName: process.env.SENTRY_SERVER_NAME || 'instagram-downloader',

      // Filter out certain errors on server side
      beforeSend(event, hint) {
        // Don't send events for expected API errors
        if (event.exception?.values?.[0]?.type === 'APIError') {
          const error = hint.originalException as any;
          if (error?.status && error.status < 500) {
            return null; // Don't report 4xx errors
          }
        }

        // Filter out ENOTFOUND errors (DNS lookup failures)
        if (event.exception?.values?.[0]?.value?.includes('ENOTFOUND')) {
          return null;
        }

        // Filter out timeout errors from Instagram API
        if (event.exception?.values?.[0]?.value?.includes('timeout')) {
          return null;
        }

        return event;
      },

      // Additional tags for server-side events
      initialScope: {
        tags: {
          component: 'server',
        },
      },
    });
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    // Edge runtime Sentry 配置
    const Sentry = await import('@sentry/nextjs');
    
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      
      // Define how likely traces are sampled. Adjust this value in production.
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      
      // Setting this option to true will print useful information to the console while you're setting up Sentry.
      debug: process.env.NODE_ENV === 'development',

      // Additional configuration
      environment: process.env.NODE_ENV || 'development',

      // Edge-specific configuration
      beforeSend(event, hint) {
        // Filter out middleware-specific errors that aren't critical
        if (event.transaction === '/middleware') {
          const error = hint.originalException;
          if (error instanceof Error && error.message.includes('headers already sent')) {
            return null;
          }
        }

        return event;
      },

      // Additional tags for edge events
      initialScope: {
        tags: {
          component: 'edge',
        },
      },
    });
  }
}

// Export request error instrumentation for Next.js
export const onRequestError = async (error: unknown, request: any) => {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const Sentry = await import('@sentry/nextjs');
    Sentry.captureRequestError(error, request);
  }
};