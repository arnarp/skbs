import { firestore } from 'firebase'

export type DocumentId = string
export type UID = string

export type BaseDocument = Readonly<{
  id: DocumentId
  ref: firestore.DocumentReference
}>
