import { firestore } from 'firebase-functions'
import * as admin from 'firebase-admin'
import { TourDocument } from '../../shared/types/Tour'
import { newValues, chunks } from '../../shared/utils/array'
import { FIRESTORE_MAX_BATCH_SIZE } from '../../shared/constants'
import { Booking } from '../../shared/types/Booking'

export const onTourUpdate = firestore.document('tours/{id}').onUpdate((change, _context) => {
  const before = change.before.data() as TourDocument
  const after = change.after.data() as TourDocument
  const update: Partial<Booking> = {
    tour: {
      name: after.name,
      id: change.after.id,
    },
  }
  if (after.synonyms.length > before.synonyms.length) {
    const additions = newValues(before.synonyms, after.synonyms)
    return Promise.all(
      additions.map(a => {
        console.log(`Synonym, ${a}, added for tour ${after.name}`, update)
        return admin
          .firestore()
          .collection('bookings')
          .where('tour', '==', null)
          .where('import.tour', '==', a)
          .get()
          .then(s => {
            console.log(`${s.size} number of bookings fetched`)
            return Promise.all(
              chunks(s.docs, FIRESTORE_MAX_BATCH_SIZE).map(chunk => {
                const batch = admin.firestore().batch()
                chunk.forEach(d => {
                  const bookingRef = admin
                    .firestore()
                    .collection('bookings')
                    .doc(d.id)
                  console.log('bookingRef', bookingRef)
                  batch.update(bookingRef, update)
                })
                return batch.commit().then(() => console.log(`${chunk.length} bookings updated`))
              }),
            )
          })
      }),
    )
  }
  return Promise.resolve()
})
