import * as React from 'react'
import { firestore } from '..'
import { Driver, DriverDocument } from '../../shared/types/Driver'
import { OrderByDirection } from '@google-cloud/firestore'
import { Collections } from '../../shared/constants'
import { FirebaseError } from 'firebase'

export function subscribeOnDrivers(params: {
  orderBy?: {
    fieldPath: keyof Driver
    directionStr: OrderByDirection
  }
  onDrivers: (drivers: Driver[]) => void
}) {
  const orderBy = params.orderBy || { fieldPath: 'name', directionStr: 'desc' }
  const collection = firestore.collection('drivers')
  let query = collection.orderBy(orderBy.fieldPath, orderBy.directionStr)
  return query.onSnapshot(s => {
    const drivers = s.docs.map<Driver>(d => ({
      id: d.id,
      ...(d.data() as DriverDocument)
    }))
    console.log('fetched drivers', drivers)
    params.onDrivers(drivers)
  })
}

export function useDrivers() {
  const [drivers, onDrivers] = React.useState<Driver[]>([])
  React.useEffect(() => {
    return subscribeOnDrivers({
      orderBy: {
        fieldPath: 'name',
        directionStr: 'asc'
      },
      onDrivers
    })
  }, [])
  return drivers
}

export function addNewDriver(params: {
  newDriverDoc: DriverDocument
  onSuccess: () => void
  onReject: (reason: FirebaseError) => void
}) {
  firestore
    .collection(Collections.Drivers)
    .add(params.newDriverDoc)
    .then(params.onSuccess)
    .catch(params.onReject)
}

export function updateDriver(params: {
  driverId: string
  update: Partial<Driver>
  onSuccess: () => void
  onReject: (reason: FirebaseError) => void
}) {
  firestore
    .collection(Collections.Drivers)
    .doc(params.driverId)
    .update(params.update)
    .then(params.onSuccess)
    .catch(params.onReject)
}

export function deleteDriver(params: {
  driverId: string
  onSuccess: () => void
  onReject: (reason: FirebaseError) => void
}) {
  firestore
    .collection(Collections.Drivers)
    .doc(params.driverId)
    .delete()
    .then(params.onSuccess)
    .catch(params.onReject)
}
