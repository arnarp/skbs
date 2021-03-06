import { auth } from "firebase-functions";
import * as admin from "firebase-admin";
import { NewUserMetaDocument } from "../../shared/types/User/UserMeta";

export const onUserCreate = auth.user().onCreate(async user => {
  const newUserMetaDocument: NewUserMetaDocument = {
    claimsRefreshTime: admin.firestore.FieldValue.serverTimestamp(),
    claims: { isAdmin: false },
    displayName: user.displayName as string,
    photoURL: user.photoURL as string,
    email: user.email as string
  };
  try {
    const result = await admin
      .firestore()
      .collection("userMetas")
      .doc(user.uid)
      .set(newUserMetaDocument);
    return console.log({ result });
  } catch (reason) {
    return console.log({ reason });
  }
});
