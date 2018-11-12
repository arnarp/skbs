import { FirebaseError } from "firebase"
import { firestore } from ".."
import { Collections } from "../../shared/constants"

export function deleteGroup(params: {
  groupId: string
  onSuccess: () => void
  onReject: (reason: FirebaseError) => void
}) {
  firestore
    .collection(Collections.Groups)
    .doc(params.groupId)
    .delete()
    .then(params.onSuccess)
    .catch(params.onReject)
}
