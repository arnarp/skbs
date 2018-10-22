import * as Sentry from '@sentry/browser'

export function breadcrumb(message: string, level: 'error' | 'info' | 'warning', data?: any) {
  if (process.env.NODE_ENV === 'production') {
    Sentry.addBreadcrumb({
      message,
      level: level as Sentry.Severity,
      data,
    })
  }
  if (process.env.NODE_ENV === 'development') {
    switch (level) {
      case 'error':
        console.error(message, data)
        break;
      case 'info':
      default:
        console.info(message, data)
        break;
    }
  }
}