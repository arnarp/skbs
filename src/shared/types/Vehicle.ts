import { firestore } from "firebase"
import { Omit } from "./utils"

export type Vehicle = {
  id: string
  name: string
  maxPax: number
}

export type VehicleDocument = Omit<Vehicle, "id">

export function parseVehicleSnapshot(
  s: firestore.DocumentSnapshot | FirebaseFirestore.DocumentSnapshot,
): Vehicle {
  return {
    ...(s.data() as VehicleDocument),
    id: s.id,
  }
}
