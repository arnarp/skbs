import { Omit } from './utils'

export type Group = {
  id: string
  // Should be unique per day
  friendlyKey: number
  date: Date
  driver?: {
    id: string
    name: string
  }
  bus?: {
    id: string
    name: string
  }
  maxPax?: number
  note?: string
}

export type GroupDocument = Omit<Group, 'id'>
