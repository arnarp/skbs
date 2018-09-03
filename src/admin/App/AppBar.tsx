import * as React from 'react'
import './AppBar.css'
import { UserInfo } from '../../shared/types/User/UserInfo'
import { Modal } from '../../shared/components/Modal'

type AppBarProps = {
  userInfo: UserInfo | null
}

const initialState = {
  userModalIsOpen: false,
}
type AppBarState = Readonly<typeof initialState>

export class AppBar extends React.PureComponent<AppBarProps, AppBarState> {
  readonly state: AppBarState = initialState
  toggleUserModalButton: HTMLButtonElement

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
              show={this.state.userModalIsOpen}
              onClose={() => this.toggleUserModal()}
              focusAfterClose={() => this.toggleUserModalButton.focus()}
              header={`Innskráður sem ${this.props.userInfo.displayName}`}
            >
              UserModal
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
