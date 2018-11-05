import { firestore } from "firebase"
import { Omit } from "./utils"

export type PickUpLocation = {
  id: string
  name: string
  synonyms: string[]
}

export type PickUpLocationDocument = Omit<PickUpLocation, "id">

export function generatePickUpLocationSynonymPickUpLocationMap(
  pickUpLocations: PickUpLocation[],
) {
  const result = new Map<string, PickUpLocation>()
  pickUpLocations.forEach(p => {
    p.synonyms.forEach(s => {
      result.set(s, p)
    })
  })
  return result
}

export function parsePickupSnapshot(
  s: firestore.DocumentSnapshot | FirebaseFirestore.DocumentSnapshot,
): PickUpLocation {
  return {
    ...(s.data() as PickUpLocationDocument),
    id: s.id,
  }
}
