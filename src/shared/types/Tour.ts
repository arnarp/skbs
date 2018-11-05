import { firestore } from "firebase";

export interface Tour extends TourDocument {
  id: string
}
export interface TourDocument {
  name: string
  synonyms: string[]
  color: string
}

export function generateTourSynonymTourMap(tours: Tour[]) {
  const result = new Map<string, Tour>()
  tours.forEach(t => {
    t.synonyms.forEach(s => {
      result.set(s, t)
    })
  })
  return result
}

export function parseTourSnapshot(
  s: firestore.DocumentSnapshot | FirebaseFirestore.DocumentSnapshot,
): Tour {
  return {
    ...(s.data() as TourDocument),
    id: s.id,
  }
}