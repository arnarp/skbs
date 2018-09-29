export type Booking = {
  date: Date
  tour: string
  pickUp: string
  bookingRef: string
  extBookingRef?: string
  pax: number
  paxDescription: string
  mainContact: string
  phoneNumber?: string
  email: string
  seller: string
  channel: string
  paymentStatus: string
  arrival: string
  operationsNote?: string
}

export function groupBookinsByPickUp(bookings: Booking[]) {
  return bookings.reduce<{
    [pickUp: string]: Booking[]
  }>((accumulator, currentValue) => {
    if (accumulator[currentValue.pickUp] === undefined) {
      accumulator[currentValue.pickUp] = []
    }
    accumulator[currentValue.pickUp].push(currentValue)
    return accumulator
  }, {})
}

export function groupBookinsByDateAndPickUp(bookings: Booking[]) {
  return bookings.reduce<{
    [dateISO: string]: {
      [pickUp: string]: Booking[]
    }
  }>((accumulator, currentValue) => {
    if (accumulator[currentValue.date.toISOString()] === undefined) {
      accumulator[currentValue.date.toISOString()] = {}
    }
    if (
      accumulator[currentValue.date.toISOString()][currentValue.pickUp] ===
      undefined
    ) {
      accumulator[currentValue.date.toISOString()][currentValue.pickUp] = []
    }
    accumulator[currentValue.date.toISOString()][currentValue.pickUp].push(
      currentValue,
    )
    return accumulator
  }, {})
}

export function countPax(bookings: Booking[]) {
  return bookings.reduce((acc, currentValue) => acc + currentValue.pax, 0)
}
