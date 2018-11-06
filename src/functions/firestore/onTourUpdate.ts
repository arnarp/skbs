import { firestore } from "firebase-functions"
import * as admin from "firebase-admin"
import { parseTourSnapshot, Tour } from "../../shared/types/Tour"
import { newValues, chunks } from "../../shared/utils/array"
import { FIRESTORE_MAX_BATCH_SIZE, Collections } from "../../shared/constants"
import { Booking } from "../../shared/types/Booking"

export const onTourUpdate = firestore
  .document("tours/{id}")
  .onUpdate(async change => {
    const before = parseTourSnapshot(change.before)
    const after = parseTourSnapshot(change.after)
    if (after.synonyms.length > before.synonyms.length) {
      await linkBookings({ before, after })
    }
    if (before.name !== after.name) {
      await updateBookingsTour(after)
    }
  })

async function updateBookingsTour(tour: Tour) {
  const bookings = await admin
    .firestore()
    .collection(Collections.Bookings)
    .where("tour.id", "==", tour.id)
    .get()
  const update: Partial<Booking> = {
    tour: {
      name: tour.name,
      id: tour.id,
    },
  }
  await Promise.all(
    chunks(bookings.docs, FIRESTORE_MAX_BATCH_SIZE).map(async chunk => {
      const batch = admin.firestore().batch()
      chunk.forEach(i => batch.update(i.ref, update))
      await batch.commit()
      console.log(`${chunk.length} bookings updated`)
    }),
  )
}

async function linkBookings(param: { before: Tour; after: Tour }) {
  const update: Partial<Booking> = {
    tour: {
      name: param.after.name,
      id: param.after.id,
    },
  }
  const additions = newValues(param.before.synonyms, param.after.synonyms)
  await Promise.all(
    additions.map(async a => {
      console.log(`Synonym, ${a}, added for tour ${param.after.name}`, update)
      const s = await admin
        .firestore()
        .collection(Collections.Bookings)
        .where("tour", "==", null)
        .where("import.tour", "==", a)
        .get()

      console.log(`${s.size} number of bookings fetched`)
      await Promise.all(
        chunks(s.docs, FIRESTORE_MAX_BATCH_SIZE).map(async chunk => {
          const batch = admin.firestore().batch()
          chunk.forEach(d => batch.update(d.ref, update))
          await batch.commit()
          console.log(`${chunk.length} bookings updated`)
        }),
      )
    }),
  )
}
