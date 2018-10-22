import * as React from 'react'
import { Booking, groupBookinsByDateAndPickUp, countPax } from '../../shared/types/Booking'

type BookingsInputProps = {
  bookings: Booking[]
}

export const BookingsInput: React.SFC<BookingsInputProps> = ({ bookings }) => {
  const bookingsGroupedByDateAndPickUp = groupBookinsByDateAndPickUp(bookings)
  return (
    <div className="bookingsInput">
      {bookings.length === 0 && <p>No new bookings to add</p>}
      {bookings.length > 0 && Object.keys(bookingsGroupedByDateAndPickUp).map(d => (
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
                    <li key={b.import.bookingRef}>
                      {b.pax} PAX - {b.import.mainContact}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <div className="total">Total PAX: {countPax(bookings)}</div>
    </div>
  )
}
