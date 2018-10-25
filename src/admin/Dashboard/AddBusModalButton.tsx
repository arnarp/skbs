import * as React from 'react'
import { Button } from '../../shared/components/Button'
import { AddModalForm } from '../../shared/components/AddModalForm'
import { firestore } from '../../firebase'
import { BusDocument } from '../../shared/types/Bus';

type AddBusModalButtonButtonProps = {}

const initialState = {
  show: false,
  name: '',
  maxPax: 0,
}
type AddBusModalButtonButtonState = Readonly<typeof initialState>

export class AddBusModalButtonButton extends React.PureComponent<
  AddBusModalButtonButtonProps,
  AddBusModalButtonButtonState
> {
  readonly state: AddBusModalButtonButtonState = initialState
  btn: HTMLButtonElement | null = null

  render() {
    return (
      <React.Fragment>
        <Button
          color="default"
          style="flat"
          inputRef={el => (this.btn = el)}
          onClick={() => this.setState(() => ({ show: true }))}
        >
          Add bus
        </Button>
        <AddModalForm
          onSubmit={this.onSubmit}
          show={this.state.show}
          onClose={() => this.setState(() => initialState)}
          focusAfterClose={() => this.btn && this.btn.focus()}
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
        </AddModalForm>
      </React.Fragment>
    )
  }

  onSubmit = (event: React.FormEvent<{}>) => {
    event.preventDefault()
    const newBusDoc: BusDocument = {
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
