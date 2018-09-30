import { Omit } from './utils'

export type Driver = {
  id: string
  name: string
}

export type DriverDocument = Omit<Driver, 'id'>
