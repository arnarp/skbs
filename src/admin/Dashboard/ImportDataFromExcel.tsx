import * as React from 'react'
import readXlsxFile, { parseExcelDate } from 'read-excel-file'
import { v4 } from 'uuid'
import { Modal } from '../../shared/components/Modal'
import './ImportDataFromExcel.css'
import { Booking, groupBookinsByPickUp, bookingId } from '../../shared/types/Booking'
import { BookingsInput } from './BookingsInput'
import { Button } from '../../shared/components/Button'
import { firestore } from '../firebase'
import { removeUndefinedFromObject } from '../../shared/utils/removeUndefinedFromObject'
import {
  PickUpLocation,
  generatePickUpLocationSynonymPickUpLocationMap,
} from '../../shared/types/PickUpLocation'
import { Tour, generateTourSynonymTourMap } from '../../shared/types/Tour'

type ImportDataFromExcelProps = {
  pickUpLocations: PickUpLocation[]
  tours: Tour[]
}
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
  input: HTMLInputElement | null = null
  inputId = v4()

  render() {
    return (
      <div className="excelReader">
        <input
          ref={ref => (this.input = ref)}
          type="file"
          id={this.inputId}
          onChange={() => {
            if (this.input === null || this.input.files === null) {
              return
            }
            readXlsxFile(this.input.files[0])
              .then((rows: any[]) => {
                const excelDate = parseExcelDate(rows[0][0]) as Date
                const date = new Date(
                  excelDate.getUTCFullYear(),
                  excelDate.getUTCMonth(),
                  excelDate.getUTCDate(),
                )
                const tourSynonymTourIdMap = generateTourSynonymTourMap(this.props.tours)
                const pickUpLocationSynonymPickUpLocationIdMap = generatePickUpLocationSynonymPickUpLocationMap(
                  this.props.pickUpLocations,
                )
                const bookings = rows.slice(3, -1).map(function(i: string[]): Booking {
                  const importedTour = i[0]
                  const importedPickUp = i[1]
                  const pickUpLocation = pickUpLocationSynonymPickUpLocationIdMap.get(
                    importedPickUp,
                  )
                  const tour = tourSynonymTourIdMap.get(importedTour)
                  return {
                    date,
                    pax: Number(i[4]),
                    pickUp:
                      pickUpLocation === undefined
                        ? undefined
                        : {
                            id: pickUpLocation.id,
                            name: pickUpLocation.name,
                          },
                    tour:
                      tour === undefined
                        ? undefined
                        : {
                            id: tour.id,
                            name: tour.name,
                          },
                    import: {
                      tour: importedTour,
                      pickUp: importedPickUp,
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
                    },
                  }
                })
                console.log(bookings)
                this.setState(() => ({ bookings }))
                if (this.input) {
                  this.input.value = ''
                }
              })
              .catch((err: any) => console.log(err))
          }}
        />
        <label htmlFor={this.inputId}>Import data</label>
        <Modal
          contentClassName="bookingsInputModal"
          fullscreen
          show={this.state.bookings !== undefined}
          onClose={() => this.setState(() => ({ bookings: undefined }))}
          focusAfterClose={() => {
            this.input && this.input.focus()
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
                this.input && this.input.focus()
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
                batch.commit().then(() => this.setState(() => ({ bookings: undefined })))
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
