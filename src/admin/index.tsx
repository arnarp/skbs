import 'normalize.css'
import './index.css'
import 'wicg-inert'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as Sentry from '@sentry/browser'
import { App } from './App/App'
import { AppErrorBoundary } from './App/AppErrorBoundary'

declare global {
  const enum Env {
    Prod = 'production',
    Dev = 'development',
  }
  interface HTMLElement {
    inert: boolean
  }
  namespace NodeJS {
    interface ProcessEnv {
      env: {
        NODE_ENV: Env
        ADMIN_VERSION: string,
        FIREBASE_API_KEY: string
        FIREBASE_AUTH_DOMAIN: string
        FIREBASE_DATABASE_URL: string
        FIREBASE_PROJECT_ID: string
        FIREBASE_STORAGE_BUCKET: string
        FIREBASE_MESSAGING_SENDER_ID: string
        SENTRY_DSN: string
      }
    }
  }
}

Sentry.init({
 dsn: process.env.SENTRY_DSN,
 environment: process.env.NODE_ENV,
 release: process.env.ADMIN_VERSION,
});

console.log({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  release: process.env.ADMIN_VERSION,
 })

ReactDOM.render(
  <AppErrorBoundary>
    <App />
  </AppErrorBoundary>,
  document.getElementById('root') as HTMLElement,
)
