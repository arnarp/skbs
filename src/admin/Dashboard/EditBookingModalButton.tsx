import * as React from 'react'
import { Booking, bookingId } from '../../shared/types/Booking'
import { Button } from '../../shared/components/Button'
import { EditIcon } from '../../shared/icons/EditIcon'
import { AddModalForm } from '../../shared/components/AddModalForm'
import { breadcrumb } from '../../shared/utils/breadcrumb'
import { firestore } from '../firebase'
import { Collections } from '../../shared/constants'
import { PickUpLocation } from '../../shared/types/PickUpLocation'
import './EditBookingModalButton.css'

type Props = {
  booking: Booking
  pickupLocations: PickUpLocation[]
}
type State = Readonly<{
  state: 'normal' | 'submitting'
  show: boolean
  pax: number
  pickupName: string
  pickup?: { id: string; name: string }
  note: string
  mainContact: string
}>

export class EditBookingModalButton extends React.PureComponent<Props, State> {
  readonly state: State
  btn: HTMLButtonElement | null = null

  constructor(props: Props) {
    super(props)
    this.state = {
      state: 'normal',
      show: false,
      pax: props.booking.pax,
      pickupName: props.booking.import.pickUp,
      pickup: props.booking.pickUp || undefined,
      note: props.booking.import.operationsNote || '',
      mainContact: props.booking.import.mainContact,
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.booking !== prevProps.booking) {
      this.setState(() => ({
        pax: this.props.booking.pax,
        pickupName: this.props.booking.import.pickUp,
        pickup: this.props.booking.pickUp || undefined,
        note: this.props.booking.import.operationsNote || '',
        mainContact: this.props.booking.import.mainContact,
      }))
    }
  }
  render() {
    return (
      <React.Fragment>
        <Button
          inputRef={el => (this.btn = el)}
          color="default"
          style="flat"
          onClick={() => this.setState(() => ({ show: true }))}
        >
          <EditIcon color="default" size="small" />
        </Button>
        <AddModalForm
          show={this.state.show}
          onClose={() => this.setState(() => ({ show: false }))}
          focusAfterClose={() => this.btn && this.btn.focus()}
          header="Edit booking"
          submitBtnLabel="Submit changes"
          onSubmit={this.onSubmit}
          submitDisabled={false}
          formClassName="EditBookingModalButton"
        >
          <label>
            <span>Pax</span>
            <input
              type="number"
              value={this.state.pax}
              onChange={event => {
                const pax = Number(event.target.value)
                this.setState(() => ({ pax }))
              }}
            />
          </label>
          <label>
            <span>Pickup</span>
            <div className="pickupInputs">
              <input
                type="text"
                value={this.state.pickupName}
                onChange={event => {
                  const pickupName = event.target.value
                  const pickup = this.props.pickupLocations.find(l =>
                    l.synonyms.includes(pickupName),
                  )
                  this.setState(() => ({
                    pickupName,
                    pickup,
                  }))
                }}
              />
              <select
                value={this.state.pickup ? this.state.pickup.id : ''}
                onChange={event => {
                  const id = event.target.value
                  this.setState(() => {
                    const pickup = this.props.pickupLocations.find(i => i.id === id)
                    return {
                      pickupName: pickup ? pickup.name : '',
                      pickup,
                    }
                  })
                }}
              >
                <option value=""> - Select pickup - </option>
                {this.props.pickupLocations.map(l => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>
          </label>
        </AddModalForm>
      </React.Fragment>
    )
  }
  onSubmit = (event: React.FormEvent<{}>) => {
    event.preventDefault()
    const update: Partial<Booking> = {
      pax: this.state.pax,
      pickUp: this.state.pickup || null,
    }
    breadcrumb('Update booking', 'info', update)
    firestore
      .collection(Collections.Bookings)
      .doc(bookingId(this.props.booking))
      .update(update)
      .then(() => {
        breadcrumb('Booking updated', 'info', update)
        this.setState(() => ({ show: false }))
      })
      .catch(reason => {
        breadcrumb('Booking update error', 'error', { reason, update })
      })
  }
}