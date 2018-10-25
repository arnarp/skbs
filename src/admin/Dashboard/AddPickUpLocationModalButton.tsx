import * as React from 'react'
import { Button } from '../../shared/components/Button'
import { AddModalForm } from '../../shared/components/AddModalForm'
import { firestore } from '../../firebase'
import { PickUpLocationDocument } from '../../shared/types/PickUpLocation';

type AddPickUpLocationModalButtonProps = {}

const initialState = () => ({
  show: false,
  name: '',
})
type AddPickUpLocationModalButtonState = Readonly<{
  show: boolean
  name: string
}>

export class AddPickUpLocationModalButton extends React.PureComponent<
  AddPickUpLocationModalButtonProps,
  AddPickUpLocationModalButtonState
> {
  readonly state: AddPickUpLocationModalButtonState = initialState()
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
          Add pick up location
        </Button>
        <AddModalForm
          onSubmit={this.onSubmit}
          show={this.state.show}
          onClose={() => this.setState(initialState())}
          focusAfterClose={() => this.btn && this.btn.focus()}
          header="Add new pickup location"
          submitBtnLabel="Add pickup location"
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
    const newDoc: PickUpLocationDocument = {
      name: this.state.name,
      synonyms: [],
    }
    firestore
      .collection('pickUpLocations')
      .add(newDoc)
      .then(() => {
        this.setState(() => initialState())
      })
  }
}
