import * as React from 'react'
import { auth } from '../firebase'
import { UserInfo } from '../../shared/types/User/UserInfo'
import { getClaims } from '../../shared/auth/getClaims'
import { UserClaims } from '../../shared/types/User/UserClaims'
import { UserMeta } from '../../shared/types/User/UserMeta'
import { AppBar } from './AppBar'
import './App.css'
import { LoginPage } from './LoginPage'
import { Dashboard } from '../Dashboard'

type AppProps = {}

const initialState = {
  userInfo: undefined as UserInfo | null | undefined,
  userClaims: undefined as UserClaims | undefined,
  userMeta: undefined as undefined | UserMeta,
}
type AppState = Readonly<typeof initialState>

export class App extends React.Component<AppProps, AppState> {
  readonly state: AppState = initialState
  readonly subscriptions: Array<() => void> = []

  componentDidMount() {
    this.subscribeToAuthStateChanged()
  }
  componentWillUnmount() {
    this.subscriptions.forEach(u => u())
  }

  render() {
    return (
      <div className="App">
        <AppBar
          userInfo={this.state.userInfo}
          signOut={() => {
            auth().signOut()
          }}
        />
        {this.state.userInfo === null && <LoginPage />}
        {this.state.userInfo && <Dashboard />}
      </div>
    )
  }

  private subscribeToAuthStateChanged() {
    const authStateSubscription = auth().onAuthStateChanged(
      async user => {
        console.log('onAuthStateChanged', user)
        const userClaims = await getClaims(user)
        this.setState(() => ({ userInfo: user as UserInfo, userClaims }))
        if (user === null) {
          return
        }
      },
      error => {
        console.log('App onAuthStateChanged error', error)
      },
    )
    this.subscriptions.push(authStateSubscription)
  }
}
