import * as admin from 'firebase-admin'
import { Collections, FIRESTORE_MAX_BATCH_SIZE } from '../shared/constants';
import { chunks } from '../shared/utils/array';
import { Booking, bookingId } from '../shared/types/Booking';
import { removeUndefinedFromObject } from '../shared/utils/removeUndefinedFromObject';

/**
 * Migration run 24. okt 2018
 */
export async function migrateBookings() {
  const firestore = admin.firestore()

  const bookings = await firestore.collection(Collections.Bookings).get()
  await chunks(bookings.docs, FIRESTORE_MAX_BATCH_SIZE).map(async chunk => {
    const batch = firestore.batch()
    chunk.forEach(b => {
      const booking = { ...(b.data() as Booking) }
      const update: Partial<Booking> = {
        pickupName: booking.import.pickUp,
        mainContact: booking.import.mainContact,
        operationsNote: booking.import.operationsNote || '',
        phoneNumber: booking.import.phoneNumber,
        email: booking.import.email,
        arrival: booking.import.arrival,
        paymentStatus: booking.import.paymentStatus,
      }
      removeUndefinedFromObject(update)
      console.info({ update })
      batch.update(firestore.collection(Collections.Bookings).doc(bookingId(booking)), update)
    })
    await batch.commit()
  })
}