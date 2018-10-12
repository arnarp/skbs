import * as React from 'react'
import { auth, firestore } from '../firebase'
import { UserInfo } from '../../shared/types/User/UserInfo'
import { getClaims } from '../../shared/auth/getClaims'
import { UserClaims } from '../../shared/types/User/UserClaims'
import { UserMeta, UserMetaDocument } from '../../shared/types/User/UserMeta'
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
  cancelUserMetaSubscription: () => void = () => {}

  componentDidMount() {
    this.subscribeToAuthStateChanged()
  }
  componentWillUnmount() {
    this.subscriptions.forEach(u => u())
  }

  async componentDidUpdate(_prevProps: AppProps, prevState: AppState) {
    if (!prevState.userInfo && this.state.userInfo) {
      this.cancelUserMetaSubscription = this.createUserMetaSubscription(this.state.userInfo)
    }
    if (prevState.userInfo && !this.state.userInfo) {
      this.cancelUserMetaSubscription()
    }
    if (
      this.state.userInfo &&
      prevState.userMeta &&
      this.state.userMeta &&
      prevState.userMeta.claimsRefreshTime !== this.state.userMeta.claimsRefreshTime
    ) {
      const userClaims = await getClaims(this.state.userInfo, {
        forceRefresh: true,
      })
      console.log('Updating user claims', { userClaims })
      this.setState(() => ({ userClaims }))
    }
  }

  render() {
    console.log('App render', this.state)
    if (this.state.userInfo === undefined) {
      return null
    }
    if (this.state.userInfo === null) {
      return (
        <div className="App">
          <LoginPage />
        </div>
      )
    }
    if (this.state.userClaims === undefined) {
      console.log('UserClaims undefined')
      return null
    }
    if (!this.state.userClaims.isAdmin) {
      return (
        <div className="App Unauthorized">
          <h1>Unauthorized</h1>
          <p>Contact administrator to get app permission.</p>
        </div>
      )
    }
    return (
      <div className="App">
        <AppBar
          userInfo={this.state.userInfo}
          signOut={() => {
            auth().signOut()
          }}
        />
        {this.state.userInfo && <Dashboard />}
      </div>
    )
  }

  private subscribeToAuthStateChanged = () => {
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
  private createUserMetaSubscription = (userInfo: UserInfo) => {
    return firestore
      .collection('userMetas')
      .doc(userInfo.uid)
      .onSnapshot(doc => {
        if (doc.exists) {
          const userMeta = { id: doc.id, ...(doc.data() as UserMetaDocument) }
          this.setState(() => ({
            userMeta,
          }))
        }
      })
  }
}
