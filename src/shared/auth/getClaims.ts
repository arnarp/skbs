import { b64DecodeUnicode } from '../utils/b64DecodeUnicode'
import { UserClaims } from '../types/User/UserClaims'

export async function getClaims(
  user: firebase.User | null,
  options: { forceRefresh: boolean } = { forceRefresh: false },
) {
  if (user === null) {
    return undefined
  }
  return user.getIdToken(options.forceRefresh).then(token => {
    return JSON.parse(b64DecodeUnicode(token.split('.')[1])) as UserClaims
  })
}
