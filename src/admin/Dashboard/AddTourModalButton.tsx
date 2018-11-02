import * as React from 'react'
import randomColor = require('randomcolor')
import { Button } from '../../shared/components/Button'
import { ModalForm } from '../../shared/components/ModalForm'
import { firestore } from '../../firebase'
import { TourDocument } from '../../shared/types/Tour'

type AddTourModalButtonProps = {}

const initialState = () => ({
  show: false,
  name: '',
  color: randomColor(),
})
type AddTourModalButtonState = Readonly<{
  show: boolean
  name: string
  color: string
}>

export class AddTourModalButton extends React.PureComponent<
  AddTourModalButtonProps,
  AddTourModalButtonState
> {
  readonly state: AddTourModalButtonState = initialState()
  btn = React.createRef<HTMLButtonElement>()

  render() {
    return (
      <React.Fragment>
        <Button
          color="default"
          style="flat"
          ref={this.btn}
          onClick={() => this.setState(() => ({ show: true }))}
        >
          Add tour
        </Button>
        <ModalForm
          onSubmit={this.onSubmit}
          show={this.state.show}
          onClose={() => this.setState(initialState())}
          focusAfterClose={() => this.btn.current && this.btn.current.focus()}
          header="Add new tour"
          submitBtnLabel="Add tour"
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
            color
            <input
              type="color"
              value={this.state.color}
              onChange={event => {
                const color = event.target.value
                this.setState(() => ({ color }))
              }}
            />
            <Button
              color="default"
              style="flat"
              onClick={() => this.setState(() => ({ color: randomColor() }))}
            >
              Random
            </Button>
          </label>
        </ModalForm>
      </React.Fragment>
    )
  }

  onSubmit = (event: React.FormEvent<{}>) => {
    event.preventDefault()
    const newDoc: TourDocument = {
      name: this.state.name,
      synonyms: [],
      color: this.state.color,
    }
    firestore
      .collection('tours')
      .add(newDoc)
      .then(() => {
        this.setState(() => initialState())
      })
  }
}
