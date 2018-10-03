import * as React from 'react'
import readXlsxFile, { parseExcelDate } from 'read-excel-file'
import uuid from 'uuid/v4'
import { Modal } from '../../shared/components/Modal'
import './ImportDataFromExcel.css'
import {
  Booking,
  groupBookinsByPickUp,
  bookingId,
} from '../../shared/types/Booking'
import { BookingsInput } from './BookingsInput'
import { Button } from '../../shared/components/Button'
import { firestore } from '../firebase'
import { removeUndefinedFromObject } from '../../shared/utils/removeUndefinedFromObject'

type ImportDataFromExcelProps = {}
type ImportDataFromExcelState = Readonly<{
  bookings?: Booking[]
}>

const initialState: ImportDataFromExcelState = {
  bookings: undefined,
}

export class ImportDataFromExcel extends React.PureComponent<
  ImportDataFromExcelProps,
  ImportDataFromExcelState
> {
  readonly state: ImportDataFromExcelState = initialState
  input: HTMLInputElement
  inputId = uuid()

  render() {
    return (
      <div className="excelReader">
        <input
          ref={ref => (this.input = ref)}
          type="file"
          id={this.inputId}
          onChange={e => {
            readXlsxFile(this.input.files[0])
              .then((rows: any[]) => {
                const excelDate = parseExcelDate(rows[0][0]) as Date
                const date = new Date(
                  excelDate.getUTCFullYear(),
                  excelDate.getUTCMonth(),
                  excelDate.getUTCDate(),
                )
                const bookings = rows
                  .slice(3, -1)
                  .map(function(i: string[]): Booking {
                    return {
                      date,
                      tour: i[0],
                      pickUp: i[1],
                      bookingRef: i[2],
                      extBookingRef: i[3] || undefined,
                      pax: Number(i[4]),
                      paxDescription: i[5],
                      mainContact: i[6],
                      phoneNumber: i[7] || undefined,
                      email: i[8],
                      seller: i[10],
                      channel: i[13],
                      paymentStatus: i[14],
                      arrival: i[15],
                      operationsNote: i[16] || undefined,
                    }
                  })
                console.log(bookings)
                this.setState(() => ({ bookings }))
                this.input.value = null
              })
              .catch(err => console.log(err))
          }}
        />
        <label htmlFor={this.inputId}>Import data</label>
        <Modal
          contentClassName="bookingsInputModal"
          fullscreen
          show={this.state.bookings !== undefined}
          onClose={() => this.setState(() => ({ bookings: undefined }))}
          focusAfterClose={() => {
            this.input.focus()
          }}
          header="Confirm data import"
        >
          <BookingsInput bookings={this.state.bookings} />
          <div className="buttons">
            <Button
              color="default"
              style="flat"
              onClick={() => {
                this.setState(() => ({ bookings: undefined }))
                this.input.focus()
              }}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              style="flat"
              onClick={() => {
                if (this.state.bookings === undefined) {
                  return
                }
                const batch = firestore.batch()
                this.state.bookings.forEach(value => {
                  const id = bookingId(value)
                  removeUndefinedFromObject(value)
                  batch.set(firestore.collection('bookings').doc(id), value)
                })
                batch
                  .commit()
                  .then(() => this.setState(() => ({ bookings: undefined })))
              }}
            >
              Import data
            </Button>
          </div>
        </Modal>
      </div>
    )
  }
}
