import * as React from 'react'
import './LoginPage.css'
import { Button } from '../../shared/components/Button'
import { auth } from '../../firebase'

type LoginPageProps = {}

const initialState = {}
type LoginPageState = Readonly<typeof initialState>

export class LoginPage extends React.PureComponent<
  LoginPageProps,
  LoginPageState
> {
  readonly state: LoginPageState = initialState

  render() {
    return (
      <div className="LoginPage">
        <Button
          color="primary"
          style="flat"
          onClick={() => {
            const provider = new auth.GoogleAuthProvider()
            provider.setCustomParameters({ prompt: 'select_account' })
            auth().signInWithRedirect(provider)
          }}
        >
          Login with google
        </Button>
      </div>
    )
  }
}
