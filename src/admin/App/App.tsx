import * as React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { auth, firestore } from '../../firebase'
import { UserInfo } from '../../shared/types/User/UserInfo'
import { getClaims } from '../../shared/auth/getClaims'
import { UserClaims } from '../../shared/types/User/UserClaims'
import { UserMeta, UserMetaDocument } from '../../shared/types/User/UserMeta'
import { AppBar } from './AppBar'
import './App.css'
import { LoginPage } from './LoginPage'
import { Dashboard } from '../Views/Dashboard'
import { Users } from '../Views/Users'
import { GroupPage } from '../Views/GroupPage'
import { AppErrorBoundary } from './AppErrorBoundary'
import { DriversPage } from '../Views/Drivers';
import { VehiclesPage } from '../Views/Vehicles/VehiclesPage';
import { PickupsPage } from '../Views/Pickups/PickupsPage';
import { ToursPage } from '../Views/Tours/ToursPage';

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
      <BrowserRouter>
        <div className="App">
          <Helmet>
            <title>SKBS admin</title>
          </Helmet>
          <AppBar
            userInfo={this.state.userInfo}
            signOut={() => {
              auth().signOut()
            }}
          />
          <AppErrorBoundary userInfo={this.state.userInfo}>
            <Route exact path="/" component={Dashboard} />
            <Route
              path="/users"
              render={props =>
                this.state.userInfo ? <Users {...props} userInfo={this.state.userInfo} /> : null
              }
            />
            <Route path="/group/:id" component={GroupPage} />
            <Route path="/drivers" component={DriversPage} />
            <Route path="/vehicles" component={VehiclesPage} />
            <Route path="/pickups" component={PickupsPage} />
            <Route path="/pickups" component={PickupsPage} />
            <Route path="/tours" component={ToursPage} />
          </AppErrorBoundary>

          <footer>{process.env.NODE_ENV === 'development' && 'development'}</footer>
        </div>
      </BrowserRouter>
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
