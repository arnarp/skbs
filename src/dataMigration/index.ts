import * as admin from 'firebase-admin'
import { Collections } from '../shared/constants'
import { DriverDocument } from '../shared/types/Driver';

var serviceAccount =
  process.env.NODE_ENV === 'development'
    ? require('../../../skbs.dev.service-account.json')
    : require('../../../skbs.prod.service-account.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://skbs-b0e5b.firebaseio.com',
})

console.log(serviceAccount)

addEntityState()
  .then(() => console.info('addEntityState migration finished'))
  .catch(reason => console.error('addEntityState migration error', reason))

export async function addEntityState() {
  const firestore = admin.firestore()

  const drivers = await firestore.collection(Collections.Drivers).get()
  const updateDriversBatch = firestore.batch()
  drivers.forEach(d => {
    const update: Partial<DriverDocument> = {
      status: 'active'
    }
    updateDriversBatch.update(d.ref, update)
  })
  await updateDriversBatch.commit()
}