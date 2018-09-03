import { User, firestore } from 'firebase/app'
import { Overwrite } from '../utils'
import { UID } from '..'

export type UserInfo = Overwrite<
  User,
  { displayName: string; photoURL: string }
>
