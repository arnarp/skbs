import * as React from "react"
import { firestore } from ".."
import { Collections } from "../../shared/constants"
import { FirebaseError } from "firebase"
import {
  PickUpLocation,
  PickUpLocationDocument,
  parsePickupSnapshot,
} from "../../shared/types/PickUpLocation"

export function subscribeOnPickups(params: {
  onPickups: (pickups: PickUpLocation[]) => void
}) {
  return firestore
    .collection(Collections.PickupLocations)
    .orderBy("name", "desc")
    .onSnapshot(s => {
      const pickups = s.docs.map<PickUpLocation>(parsePickupSnapshot)
      params.onPickups(pickups)
    })
}

export function usePickups() {
  const [pickups, onPickups] = React.useState<PickUpLocation[]>([])
  React.useEffect(() => {
    return subscribeOnPickups({
      onPickups,
    })
  }, [])
  return pickups
}

export function addNewPickup(params: {
  newPickupDoc: PickUpLocationDocument
  onSuccess: () => void
  onReject: (reason: FirebaseError) => void
}) {
  firestore
    .collection(Collections.PickupLocations)
    .add(params.newPickupDoc)
    .then(params.onSuccess)
    .catch(params.onReject)
}

export function updatePickup(params: {
  pickupId: string
  update: Partial<PickUpLocation>
  onSuccess: () => void
  onReject: (reason: FirebaseError) => void
}) {
  firestore
    .collection(Collections.PickupLocations)
    .doc(params.pickupId)
    .update(params.update)
    .then(params.onSuccess)
    .catch(params.onReject)
}

export function deletePickup(params: {
  pickupId: string
  onSuccess: () => void
  onReject: (reason: FirebaseError) => void
}) {
  firestore
    .collection(Collections.PickupLocations)
    .doc(params.pickupId)
    .delete()
    .then(params.onSuccess)
    .catch(params.onReject)
}
