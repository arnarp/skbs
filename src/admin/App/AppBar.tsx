import * as React from 'react'
import './AppBar.css'
import { UserInfo } from '../../shared/types/User/UserInfo'
import { Modal } from '../../shared/components/Modal'
import { Avatar } from '../../shared/components/Avatar'
import { Button } from '../../shared/components/Button'

type AppBarProps = {
  userInfo?: UserInfo | null
  signOut: () => void
}

const initialState = {
  userModalIsOpen: false,
}
type AppBarState = Readonly<typeof initialState>

export class AppBar extends React.PureComponent<AppBarProps, AppBarState> {
  readonly state: AppBarState = initialState
  toggleUserModalButton: HTMLButtonElement | null = null
  signOutTimeout: NodeJS.Timer | undefined

  componentWillUnmount() {
    if (this.signOutTimeout) {
      clearTimeout(this.signOutTimeout)
    }
  }

  render() {
    return (
      <div className="AppBar" role="banner">
        <span>Admin</span>
        {this.props.userInfo && (
          <React.Fragment>
            <button
              className="UserBtn"
              ref={el => (this.toggleUserModalButton = el)}
              onClick={() => this.toggleUserModal()}
            >
              <img className="UserImg" src={this.props.userInfo.photoURL} />
            </button>
            <Modal
              hideHeader={true}
              show={this.state.userModalIsOpen}
              onClose={() => this.toggleUserModal()}
              focusAfterClose={() => {
                if (this.toggleUserModalButton) {
                  this.toggleUserModalButton.focus()
                }
              }}
              header={`Logged in as ${this.props.userInfo.displayName}`}
              contentClassName="userModalContent"
            >
              <div className="avatarPanel">
                <Avatar size="xLarge" photoURL={this.props.userInfo.photoURL} />
                <span className="name">{this.props.userInfo.displayName}</span>
                <span>{this.props.userInfo.email}</span>
              </div>
              <div className="footerPanel">
                <Button
                  color="default"
                  style="flat"
                  onClick={() => {
                    this.toggleUserModal()
                    this.signOutTimeout = setTimeout(
                      () => this.props.signOut(),
                      300,
                    )
                  }}
                >
                  Logout
                </Button>
              </div>
            </Modal>
          </React.Fragment>
        )}
      </div>
    )
  }

  private toggleUserModal() {
    this.setState(previusState => ({
      userModalIsOpen: !previusState.userModalIsOpen,
    }))
  }
}
