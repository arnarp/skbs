import * as React from 'react'
import readXlsxFile, { parseExcelDate } from 'read-excel-file'
import uuid from 'uuid/v4'
import './ExcelReader.css'

type Booking = {
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

type ExcelReaderTestProps = {}
type ExcelReaderTestState = Readonly<{}>

const initialState: ExcelReaderTestState = {}

export class ExcelReader extends React.PureComponent<
  ExcelReaderTestProps,
  ExcelReaderTestState
> {
  readonly state: ExcelReaderTestState = initialState
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
                const date = parseExcelDate(rows[0][0]) as Date
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
              })
              .catch(err => console.log(err))
          }}
        />
        <label htmlFor={this.inputId}>Choose a file</label>
      </div>
    )
  }
}
