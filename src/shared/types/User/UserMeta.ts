import { Omit, Overwrite } from '../utils'
import { UserClaims } from './UserClaims'

export type UserMeta = Readonly<{
  id: string
  claimsRefreshTime: Date
  claims: UserClaims
  displayName: string
  photoURL: string
  email: string
}>

export type UserMetaDocument = Omit<UserMeta, 'id'>

export type NewUserMetaDocument = Overwrite<
  UserMetaDocument,
  {
    claimsRefreshTime: firebase.firestore.FieldValue
  }
>
