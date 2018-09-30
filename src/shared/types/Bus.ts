import { Omit } from './utils'

export type Bus = {
  id: string
  name: string
  maxPax: number
}

export type BusDocument = Omit<Bus, 'id'>
