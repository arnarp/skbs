import { auth, firestore } from 'firebase-functions'
import * as admin from 'firebase-admin'
import { UserMetaDocument } from '../../shared/types/User/UserMeta'
import { Overwrite } from '../../shared/types/utils'

type NewUserMetaDocument = Overwrite<
  UserMetaDocument,
  {
    claimsRefreshTime: admin.firestore.FieldValue
  }
>

export const onUserCreate = auth.user().onCreate((user, context) => {
  const newUserMetaDocument: NewUserMetaDocument = {
    claimsRefreshTime: admin.firestore.FieldValue.serverTimestamp(),
    claims: { isAdmin: false },
    displayName: user.displayName,
    photoURL: user.photoURL,
    email: user.email,
  }
  return admin
    .firestore()
    .collection('userMetas')
    .doc(user.uid)
    .set(newUserMetaDocument)
    .then(result => console.log({ result }))
    .catch(reason => console.log({ reason }))
})
