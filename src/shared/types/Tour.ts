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

// export interface TourMapItem {
//   tourId: string
//   tourName: string
//   key: string
// }

// export interface MergedTour {}

// export interface Day {
//   tours: Array<Tour | MergedTour>
// }
