import 'normalize.css'
import './index.css'
import 'wicg-inert'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { App } from './App/App'

declare global {
  const enum Env {
    Prod = 'production',
    Test = 'test',
    Dev = 'development',
  }
  interface HTMLElement {
    inert: boolean
  }
  namespace NodeJS {
    interface ProcessEnv {
      env: {
        NODE_ENV: Env
        FIREBASE_API_KEY: string
        FIREBASE_AUTH_DOMAIN: string
        FIREBASE_DATABASE_URL: string
        FIREBASE_PROJECT_ID: string
        FIREBASE_STORAGE_BUCKET: string
        FIREBASE_MESSAGING_SENDER_ID: string
      }
    }
  }
}

ReactDOM.render(<App />, document.getElementById('root') as HTMLElement)
