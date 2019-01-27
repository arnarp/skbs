import * as React from 'react'
import { firestore } from '..'
import { Collections } from '../../shared/constants'
import { FirebaseError } from 'firebase'
import { Tour, parseTourSnapshot, TourDocument } from '../../shared/types/Tour'

export function subscribeOnTours(params: { onTours: (tours: Tour[]) => void }) {
  return firestore
    .collection(Collections.Tours)
    .orderBy('name', 'desc')
    .onSnapshot(s => {
      const tours = s.docs.map(parseTourSnapshot)
      params.onTours(tours)
    })
}

export function useTours() {
  const [drivers, onTours] = React.useState<Tour[]>([])
  React.useEffect(() => {
    return subscribeOnTours({
      onTours
    })
  }, [])
  return drivers
}

export function addNewTour(params: {
  newTourDoc: TourDocument
  onSuccess: () => void
  onReject: (reason: FirebaseError) => void
}) {
  firestore
    .collection(Collections.Tours)
    .add(params.newTourDoc)
    .then(params.onSuccess)
    .catch(params.onReject)
}

export function updateTour(params: {
  tourId: string
  update: Partial<Tour>
  onSuccess: () => void
  onReject: (reason: FirebaseError) => void
}) {
  firestore
    .collection(Collections.Tours)
    .doc(params.tourId)
    .update(params.update)
    .then(params.onSuccess)
    .catch(params.onReject)
}

export function deleteTour(params: {
  tourId: string
  onSuccess: () => void
  onReject: (reason: FirebaseError) => void
}) {
  firestore
    .collection(Collections.Tours)
    .doc(params.tourId)
    .delete()
    .then(params.onSuccess)
    .catch(params.onReject)
}
