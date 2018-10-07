export type Booking = {
  date: Date
  groupId?: string
  pax: number
  tour?: {
    name: string
    id: string
  }
  pickUp?: {
    name: string
    id: string
  }
  import: {
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
}

export function bookingId(booking: Booking) {
  return `${booking.date.toISOString()}_${booking.import.bookingRef}`
}

export function totalPax(bookings: Booking[]) {
  return bookings.reduce((acc, val) => acc + val.pax, 0)
}

type BookingsByPickUp = {
  // If undefined then not a know pickup
  pickUpId?: string
  pickUpName: string
  bookings: Booking[]
}

export function groupBookinsByPickUp(bookings: Booking[]): BookingsByPickUp[] {
  const r: { [pickUpName: string]: BookingsByPickUp } = {}
  bookings.forEach(b => {
    if (b.pickUp) {
      if (r[b.pickUp.name] === undefined) {
        r[b.pickUp.name] = {
          pickUpId: b.pickUp.id,
          pickUpName: b.pickUp.name,
          bookings: [],
        }
      }
    } else {
      if (r[b.import.pickUp] === undefined) {
        r[b.import.pickUp] = {
          pickUpName: b.import.pickUp,
          bookings: [],
        }
      }
    }
  })
  return Object.values(r).map(i => ({
    ...i,
    bookings: bookings.filter(
      b => (b.pickUp ? b.pickUp.name === i.pickUpName : b.import.pickUp === i.pickUpName),
    ),
  }))
}

type BookingsByDateAndPickUp = {
  [dateISO: string]: {
    [pickUp: string]: Booking[]
  }
}

export function groupBookinsByDateAndPickUp(bookings: Booking[]): BookingsByDateAndPickUp {
  return bookings.reduce<BookingsByDateAndPickUp>((accumulator, currentValue) => {
    if (accumulator[currentValue.date.toISOString()] === undefined) {
      accumulator[currentValue.date.toISOString()] = {}
    }
    const pickUp =
      currentValue.pickUp === undefined ? currentValue.import.pickUp : currentValue.pickUp.name
    if (accumulator[currentValue.date.toISOString()][pickUp] === undefined) {
      accumulator[currentValue.date.toISOString()][pickUp] = []
    }
    accumulator[currentValue.date.toISOString()][pickUp].push(currentValue)
    return accumulator
  }, {})
}

export function countPax(bookings: Booking[]) {
  return bookings.reduce((acc, currentValue) => acc + currentValue.pax, 0)
}

type BookingByTourAndPickUp = {
  // If undefined then not a known tour
  tourId?: string
  tourName: string
  bookingsByPickUp: {
    // If undefined then not a know pickup
    pickUpId?: string
    pickUpName: string
    bookings: Booking[]
  }[]
}
type BookingsByTourAndPickUp = BookingByTourAndPickUp[]

export function groupBookingsByTourAndPickup(bookings: Booking[]): BookingsByTourAndPickUp {
  const result: { [name: string]: BookingByTourAndPickUp } = {}
  bookings.forEach(b => {
    if (b.tour) {
      if (result[b.tour.name] === undefined) {
        result[b.tour.name] = {
          tourId: b.tour.id,
          tourName: b.tour.name,
          bookingsByPickUp: [],
        }
      }
    } else {
      if (result[b.import.tour] === undefined) {
        result[b.import.tour] = {
          tourName: b.import.tour,
          bookingsByPickUp: [],
        }
      }
    }
  })
  Object.values(result).forEach(r => {
    const tourBookings = bookings.filter(
      b => (b.tour ? b.tour.name === r.tourName : b.import.tour === r.tourName),
    )
    r.bookingsByPickUp = groupBookinsByPickUp(tourBookings)
  })
  return Object.values(result)
}
