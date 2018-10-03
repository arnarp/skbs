import { Omit } from './utils'

export type Group = {
  id: string
  // Should be unique per day
  friendlyKey: number
  date: Date
  driverId?: string
  driverName?: string
  busId?: string
  busName?: string
  pax: number
  maxPax?: number
}

export type GroupDocument = Omit<Group, 'id'>
