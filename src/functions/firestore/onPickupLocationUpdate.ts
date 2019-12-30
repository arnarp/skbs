import { firestore } from "firebase-functions";
import * as admin from "firebase-admin";
import { newValues, chunks } from "../../shared/utils/array";
import { FIRESTORE_MAX_BATCH_SIZE, Collections } from "../../shared/constants";
import { Booking } from "../../shared/types/Booking";
import {
  PickUpLocation,
  parsePickupSnapshot
} from "../../shared/types/PickUpLocation";

export const onPickupLocationUpdate = firestore
  .document("pickUpLocations/{id}")
  .onUpdate(async (change, _context) => {
    const before = parsePickupSnapshot(change.before);
    const after = parsePickupSnapshot(change.after);
    if (after.synonyms.length > before.synonyms.length) {
      await linkBookings(after, before);
    }
    if (before.name !== after.name) {
      await updateBookingsPickup(after);
    }
  });

async function updateBookingsPickup(pickup: PickUpLocation) {
  const bookings = await admin
    .firestore()
    .collection(Collections.Bookings)
    .where("pickUp.id", "==", pickup.id)
    .get();
  const update: Partial<Booking> = {
    pickUp: {
      name: pickup.name,
      id: pickup.id
    }
  };
  await Promise.all(
    chunks(bookings.docs, FIRESTORE_MAX_BATCH_SIZE).map(async chunk => {
      const batch = admin.firestore().batch();
      chunk.forEach(i => {
        batch.update(i.ref, update);
      });
      await batch.commit();
      console.log(`${chunk.length} bookings updated`);
    })
  );
}

async function linkBookings(after: PickUpLocation, before: PickUpLocation) {
  const update: Partial<Booking> = {
    pickUp: {
      name: after.name,
      id: after.id
    }
  };
  const additions = newValues(before.synonyms, after.synonyms);
  await Promise.all(
    additions.map(async a => {
      console.log(
        `Synonym, ${a}, added for pickup location ${after.name}`,
        update
      );
      const bookings = await admin
        .firestore()
        .collection(Collections.Bookings)
        .where("pickUp", "==", null)
        .where("pickupName", "==", a)
        .get();
      console.log(`${bookings.size} number of bookings fetched`);
      await Promise.all(
        chunks(bookings.docs, FIRESTORE_MAX_BATCH_SIZE).map(async chunk => {
          const batch = admin.firestore().batch();
          chunk.forEach(d => {
            const bookingRef = admin
              .firestore()
              .collection("bookings")
              .doc(d.id);
            batch.update(bookingRef, update);
          });
          await batch.commit();
          console.log(`${chunk.length} bookings updated`);
        })
      );
    })
  );
}
