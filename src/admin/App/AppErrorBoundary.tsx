import * as React from 'react'
import * as Sentry from '@sentry/browser'
import { Button } from '../../shared/components/Button'
import './AppErrorBoundary.css'
import { UserInfo } from 'firebase'
import { ReportDialogOptions } from '@sentry/browser'

type Props = {
  userInfo?: UserInfo | null
}
type State = Readonly<{
  error?: unknown
}>

const initialState: State = {
  error: undefined,
}

export class AppErrorBoundary extends React.Component<Props, State> {
  readonly state: State = initialState

  componentDidCatch?(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ error })
    console.log({ error, errorInfo, NODE_ENV: process.env.NODE_ENV })
    if ((process.env.NODE_ENV === 'production')) {
      Sentry.withScope(scope => {
        scope.setExtra('componentStack', errorInfo.componentStack)
        Sentry.captureException(error)
      })
    }
  }

  render() {
    const options: ReportDialogOptions = {
      user: this.props.userInfo
        ? {
            email: this.props.userInfo.email || undefined,
            name: this.props.userInfo.displayName || undefined,
          }
        : undefined,
    }
    return (
      <React.Fragment>
        {this.state.error === undefined && this.props.children}
        {this.state.error && (
          <main className="AppErrorBoundary">
            <h1>Unexpected error has occured</h1>
            <Button style="flat" color="default" onClick={() => Sentry.showReportDialog(options)}>
              Report feedback
            </Button>
          </main>
        )}
      </React.Fragment>
    )
  }
}
