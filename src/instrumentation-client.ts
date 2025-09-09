// This file configures the initialization of Sentry on the browser side.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Define how likely traces are sampled. Adjust this value in production.
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Define how likely Replay events are sampled.
  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production.
  replaysSessionSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 0.1,

  // Define how likely Replay events are sampled when an error occurs.
  replaysOnErrorSampleRate: 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: process.env.NODE_ENV === 'development',

  // Capture console errors
  captureConsoleErrors: true,

  // Additional configuration
  environment: process.env.NODE_ENV || 'development',

  // Filter out certain errors
  beforeSend(event, hint) {
    // Filter out network errors from ad blockers
    if (event.exception?.values?.[0]?.type === 'NetworkError') {
      return null;
    }
    
    // Filter out specific known issues
    const error = hint.originalException;
    if (error instanceof Error) {
      // Filter out extension-related errors
      if (error.message.includes('Extension context invalidated')) {
        return null;
      }
      
      // Filter out ResizeObserver errors (common and harmless)
      if (error.message.includes('ResizeObserver loop limit exceeded')) {
        return null;
      }
      
      // Filter out non-actionable script errors
      if (error.message === 'Script error.' && !error.stack) {
        return null;
      }
    }
    
    return event;
  },

  // Additional tags
  initialScope: {
    tags: {
      component: 'client',
    },
  },

  // Integration configuration
  integrations: [
    Sentry.replayIntegration({
      // Mask all text content, passwords, emails and usernames
      maskAllText: false,
      // Don't record any interactions
      maskAllInputs: true,
      // Don't record clicks on buttons
      blockAllMedia: true,
    }),
  ],
});

// Export router transition instrumentation for Next.js
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;