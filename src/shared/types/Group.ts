import { Omit } from './utils'

export type Group = {
  id: string
  date: Date
  driverId?: string
  driverName?: string
  busId?: string
  busName?: string
  pax: number
  maxPax?: number
}

export type GroupDocument = Omit<Group, 'id'>
