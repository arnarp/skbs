import * as React from 'react'
import {
  Booking,
  groupBookinsByDateAndPickUp,
  countPax,
} from '../../shared/types/Booking'
import { Button } from '../../shared/components/Button'

type BookingsInputModalProps = {
  bookings?: Booking[]
}

export const BookingsInputModal: React.SFC<BookingsInputModalProps> = ({
  bookings,
}) => {
  if (bookings === undefined) {
    return null
  }

  const bookingsGroupedByDateAndPickUp = groupBookinsByDateAndPickUp(bookings)
  return (
    <div className="bookingsInputModal">
      {Object.keys(bookingsGroupedByDateAndPickUp).map(d => (
        <div key={d}>
          <h3>
            {new Date(d).toLocaleDateString('en-GB', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </h3>
          <ul className="pickUpLocationsList">
            {Object.keys(bookingsGroupedByDateAndPickUp[d]).map(i => (
              <li key={i}>
                <h4>{i}</h4>
                <ul>
                  {bookingsGroupedByDateAndPickUp[d][i].map(b => (
                    <li key={b.bookingRef}>
                      {b.pax} PAX - {b.mainContact}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <div className="total">Total PAX: {countPax(bookings)}</div>
      <div className="buttons">
        <Button color="secondary" style="flat">
          Cancel
        </Button>
        <Button color="default" style="flat">
          Import data
        </Button>
      </div>
    </div>
  )
}
