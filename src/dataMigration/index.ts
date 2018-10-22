import * as admin from 'firebase-admin'
import { Collections, FIRESTOR_MAX_BATCH_SIZE } from '../shared/constants'
import { chunks } from '../shared/utils/array'
import { Booking, bookingId } from '../shared/types/Booking'
import { removeUndefinedFromObject } from '../shared/utils/removeUndefinedFromObject';

var serviceAccount =
  process.env.NODE_ENV === 'development'
    ? require('../../../skbs.dev.service-account.json')
    : require('../../../skbs.prod.service-account.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://skbs-b0e5b.firebaseio.com',
})

console.log(serviceAccount)

migrateBookings()
  .then(() => console.info('Booking migration finished'))
  .catch(reason => console.error('Booking migration error', reason))

async function migrateBookings() {
  const firestore = admin.firestore()

  const bookings = await firestore.collection(Collections.Bookings).get()
  await chunks(bookings.docs, FIRESTOR_MAX_BATCH_SIZE).map(async chunk => {
    const batch = firestore.batch()
    chunk.forEach(b => {
      const booking = { ...(b.data() as Booking) }
      const update: Partial<Booking> = {
        pickupName: booking.import.pickUp,
        mainContact: booking.import.mainContact,
        operationsNote: booking.import.operationsNote || '',
        phoneNumber: booking.import.phoneNumber,
        email: booking.import.email,
        arrival: booking.import.arrival
      }
      removeUndefinedFromObject(update)
      console.info({ update })
      batch.update(firestore.collection(Collections.Bookings).doc(bookingId(booking)), update)
    })
    await batch.commit()
  })
}
