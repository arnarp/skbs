import { BaseDocument } from '..'
import { Omit, Overwrite } from '../utils'
import { UserClaims } from './UserClaims'
import { firestore } from 'firebase'

export type UserMeta = BaseDocument &
  Readonly<{
    claimsRefreshTime: Date
    claims: UserClaims
    displayName: string
    photoURL: string
    email: string
  }>

export type UserMetaDocument = Omit<UserMeta, 'id' | 'ref'>
