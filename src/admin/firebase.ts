import { initializeApp, firestore as fire, auth as a } from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/messaging'

const config = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
}
initializeApp(config)

export const firestore = fire()
firestore.settings({ timestampsInSnapshots: true })
export const auth = a
