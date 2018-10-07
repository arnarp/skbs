import * as React from 'react'
import { Button } from '../../shared/components/Button'
import { AddModalForm } from '../../shared/components/AddModalForm'
import { DriverDocument } from '../../shared/types/Driver'
import { firestore } from '../firebase'

type AddDriverModalButtonProps = {}

const initialState = {
  show: false,
  name: '',
}
type AddDriverModalButtonState = Readonly<typeof initialState>

export class AddDriverModalButton extends React.PureComponent<
  AddDriverModalButtonProps,
  AddDriverModalButtonState
> {
  readonly state: AddDriverModalButtonState = initialState
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
          Add driver
        </Button>
        <AddModalForm
          onSubmit={this.onSubmit}
          show={this.state.show}
          onClose={() => ({
            show: false,
            name: '',
          })}
          focusAfterClose={() => this.btn && this.btn.focus()}
          header="Add new driver"
          submitBtnLabel="Add driver"
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
        </AddModalForm>
      </React.Fragment>
    )
  }

  onSubmit = (event: React.FormEvent<{}>) => {
    event.preventDefault()
    const newDriverDoc: DriverDocument = {
      name: this.state.name,
    }
    firestore
      .collection('drivers')
      .add(newDriverDoc)
      .then(() => {
        this.setState(() => ({ show: false, name: '' }))
      })
  }
}
