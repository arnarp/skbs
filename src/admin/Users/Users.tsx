import * as React from 'react'
import './Users.css'
import { firestore } from '../../firebase'
import { Collections } from '../../shared/constants'
import { UserMeta, UserMetaDocument } from '../../shared/types/User/UserMeta'
import { Avatar } from '../../shared/components/Avatar'
import { UserInfo } from '../../shared/types/User/UserInfo';

const hiddenUsers = ["gloi.arnarsson@gmail.com", "arnarp@gmail.com"]

type UsersProps = {
  userInfo: UserInfo
}
type UsersState = Readonly<{
  users: ReadonlyArray<UserMeta>
}>
const initialState: UsersState = {
  users: [],
}

export class Users extends React.PureComponent<UsersProps, UsersState> {
  readonly state: UsersState = initialState
  cancelUserMetasSubscription: () => void = () => {}

  componentDidMount() {
    this.cancelUserMetasSubscription = this.createUserMetasSubscription()
  }
  componentWillUnmount() {
    this.cancelUserMetasSubscription()
  }

  render() {
    console.log(this.state)
    return (
      <main className="Users">
        <h1>Users</h1>
        <table>
          <thead>
            <tr>
              <td />
              <td>Name</td>
              <td>Admin</td>
            </tr>
          </thead>
          <tbody>
            {this.state.users.filter(u => (this.props.userInfo.email !== null && this.props.userInfo.email === 'arnarp@gmail.com') || !hiddenUsers.includes(u.email)).map(u => (
              <tr key={u.id}>
                <td>
                  <Avatar size="default" photoURL={u.photoURL} />
                </td>
                <td>{u.displayName}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={u.claims.isAdmin}
                    onChange={() => this.toggleAdmin(u)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    )
  }
  toggleAdmin = (u: UserMeta) => {
    const update: Partial<UserMetaDocument> = {
      claims: {
        ...u.claims,
        isAdmin: !u.claims.isAdmin,
      },
    }
    firestore
      .collection(Collections.UserMetas)
      .doc(u.id)
      .update(update)
      .then(() => console.log('user claim updated', { u, update }))
  }
  createUserMetasSubscription = () => {
    return firestore
      .collection(Collections.UserMetas)
      .orderBy('displayName', 'asc')
      .onSnapshot(s => {
        const users = s.docs.map<UserMeta>(t => ({
          ...(t.data() as UserMetaDocument),
          id: t.id,
        }))
        this.setState(() => ({ users }))
      })
  }
}
