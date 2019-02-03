import * as React from 'react'
import { Vehicle, VehicleDocument } from '../../shared/types/Vehicle'
import { firestore } from '..'
import { Collections } from '../../shared/constants'
import { FirebaseError } from 'firebase'

export function subscribeOnVehicles(params: {
  onVehicles: (vehicles: Vehicle[]) => void
}) {
  return firestore
    .collection(Collections.Vehicles)
    .orderBy('name', 'asc')
    .onSnapshot(s => {
      const buses = s.docs.map<Vehicle>(d => ({
        id: d.id,
        ...(d.data() as VehicleDocument)
      }))
      params.onVehicles(buses)
    })
}

export function useVehicles() {
  const [vehicles, onVehicles] = React.useState<Vehicle[]>([])
  React.useEffect(() => {
    return subscribeOnVehicles({
      onVehicles
    })
  }, [])
  return vehicles
}

export function updateVehicle(params: {
  vehicleId: string
  update: Partial<Vehicle>
  onSuccess: () => void
  onReject: (reason: FirebaseError) => void
}) {
  firestore
    .collection(Collections.Vehicles)
    .doc(params.vehicleId)
    .update(params.update)
    .then(params.onSuccess)
    .catch(params.onReject)
}

export function deleteVehicle(params: {
  vehicleId: string
  onSuccess: () => void
  onReject: (reason: FirebaseError) => void
}) {
  firestore
    .collection(Collections.Vehicles)
    .doc(params.vehicleId)
    .delete()
    .then(params.onSuccess)
    .catch(params.onReject)
}
