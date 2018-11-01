import { Omit } from './utils'
import { EntityStatus } from './types';

export type Driver = {
  id: string
  name: string
  phoneNumber?: string
  status: EntityStatus
}

export type DriverDocument = Omit<Driver, 'id'>
