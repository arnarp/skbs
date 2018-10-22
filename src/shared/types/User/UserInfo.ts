import { User } from 'firebase/app'
import { Overwrite } from '../utils'

export type UserInfo = Overwrite<
  User,
  { displayName: string; photoURL: string }
>
