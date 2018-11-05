import * as React from 'react'
import { Button } from '../../../shared/components/Button'
import { ModalForm } from '../../../shared/components/ModalForm'
import { firestore } from '../../../firebase'
import { VehicleDocument } from '../../../shared/types/Vehicle';

type AddBusModalButtonButtonProps = {}

const initialState = {
  show: false,
  name: '',
  maxPax: 0,
}
type AddBusModalButtonButtonState = Readonly<typeof initialState>

export class AddVehicleModalButtonButton extends React.PureComponent<
  AddBusModalButtonButtonProps,
  AddBusModalButtonButtonState
> {
  readonly state: AddBusModalButtonButtonState = initialState
  btn = React.createRef<HTMLButtonElement>()

  render() {
    return (
      <React.Fragment>
        <Button
          color="default"
          ref={this.btn}
          onClick={() => this.setState(() => ({ show: true }))}
        >
          Add bus
        </Button>
        <ModalForm
          onSubmit={this.onSubmit}
          show={this.state.show}
          onClose={() => this.setState(() => initialState)}
          focusAfterClose={() => this.btn.current && this.btn.current.focus()}
          header="Add new bus"
          submitBtnLabel="Add bus"
        >
          <label>
            Name
            <input
              type="text"
              value={this.state.name}
              onChange={event => {
                const name = event.target.value
                this.setState(() => ({ name }))
              }}
            />
          </label>
          <label>
            Max PAX
            <input
              type="number"
              value={this.state.maxPax}
              onChange={event => {
                const maxPax = Number(event.target.value)
                this.setState(() => ({ maxPax }))
              }}
            />
          </label>
        </ModalForm>
      </React.Fragment>
    )
  }

  onSubmit = (event: React.FormEvent<{}>) => {
    event.preventDefault()
    const newBusDoc: VehicleDocument = {
      name: this.state.name,
      maxPax: this.state.maxPax,
    }
    firestore
      .collection('buses')
      .add(newBusDoc)
      .then(() => {
        this.setState(() => initialState)
      })
  }
}
