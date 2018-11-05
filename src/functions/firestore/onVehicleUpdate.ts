import { firestore } from "firebase-functions"
import * as admin from "firebase-admin"
import { Collections, FIRESTORE_MAX_BATCH_SIZE } from "../../shared/constants"
import { chunks } from "../../shared/utils/array";
import { Group } from "../../shared/types/Group";
import { parseVehicleSnapshot, Vehicle } from "../../shared/types/Vehicle";

export const onVehicleUpdate = firestore
  .document(`${Collections.Vehicles}/{id}`)
  .onUpdate(async (change) => {
    const vehicle = parseVehicleSnapshot(change.after)
    await updateGroups(vehicle)
  })

async function updateGroups(vehicle: Vehicle) {
  const groupsToUpdate = await admin
    .firestore()
    .collection(Collections.Groups)
    .where("bus.id", "==", vehicle.id)
    .get()
  const update: Partial<Group> = {
    driver: {
      id: vehicle.id,
      name: vehicle.name,
    },
    maxPax: vehicle.maxPax,
  }
  await Promise.all(chunks(groupsToUpdate.docs, FIRESTORE_MAX_BATCH_SIZE).map(async chunk => {
    const batch = admin.firestore().batch()
    chunk.forEach(i => {
      batch.update(i.ref, update)
    })
    await batch.commit()
  }))
}
