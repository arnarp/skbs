import { firestore } from 'firebase-functions'
import * as admin from 'firebase-admin'
import { Collections, FIRESTORE_MAX_BATCH_SIZE } from '../../shared/constants'
import { Driver, parseDriverSnapshot } from '../../shared/types/Driver'
import { chunks } from '../../shared/utils/array'
import { Group } from '../../shared/types/Group'

export const onDriverUpdate = firestore
  .document(`${Collections.Drivers}/{id}`)
  .onUpdate(async change => {
    const driver = parseDriverSnapshot(change.after)
    await updateGroups(driver)
  })

async function updateGroups(driver: Driver) {
  const groupsToUpdate = await admin
    .firestore()
    .collection(Collections.Groups)
    .where('driver.id', '==', driver.id)
    .get()
  const update: Partial<Group> = {
    driver: {
      id: driver.id,
      name: driver.name
    }
  }
  if (driver.phoneNumber) {
    update.driver!.phoneNumber = driver.phoneNumber
  }
  await Promise.all(
    chunks(groupsToUpdate.docs, FIRESTORE_MAX_BATCH_SIZE).map(async chunk => {
      const batch = admin.firestore().batch()
      chunk.forEach(i => {
        batch.update(i.ref, update)
      })
      await batch.commit()
    })
  )
}
