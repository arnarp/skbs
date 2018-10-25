import * as React from 'react'
import { Button } from '../../shared/components/Button'
import { LinkIcon } from '../../shared/icons/LinkIcon'
import { AddModalForm } from '../../shared/components/AddModalForm'
import { firestore } from '../../firebase'
import { PickUpLocation, PickUpLocationDocument } from '../../shared/types/PickUpLocation'
import { Collections } from '../../shared/constants'

type LinkPickupLocModalButtonProps = {
  pickupLocations: PickUpLocation[]
  synonym: string
}

const initialState = {
  show: false,
  selected: undefined as PickUpLocation | undefined,
}
type LinkPickupLocModalButtonState = Readonly<typeof initialState>

export class LinkPickupLocModalButton extends React.PureComponent<
  LinkPickupLocModalButtonProps,
  LinkPickupLocModalButtonState
> {
  readonly state: LinkPickupLocModalButtonState = initialState
  btn: HTMLButtonElement | null = null

  render() {
    return (
      <React.Fragment>
        <Button
          inputRef={el => (this.btn = el)}
          color="default"
          style="flat"
          onClick={() => this.setState(() => ({ show: true }))}
        >
          <LinkIcon color="primary" size="small" />
        </Button>
        <AddModalForm
          show={this.state.show}
          onClose={() => this.setState(() => initialState)}
          focusAfterClose={() => this.btn && this.btn.focus()}
          header="Link pickup location"
          submitBtnLabel="Link pickup location"
          onSubmit={this.onSubmit}
          submitDisabled={this.state.selected === undefined}
        >
          <p>Link {this.props.synonym} to</p>
          <label>
            Choose pickup location
            <select
              value={this.state.selected === undefined ? '' : this.state.selected.id}
              onChange={event => {
                const selectedId = event.target.value
                const selected = this.props.pickupLocations.find(i => i.id === selectedId)
                this.setState(() => ({ selected }))
              }}
            >
              <option value=""> - Choose pickup location - </option>
              {this.props.pickupLocations.map(d => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </label>
        </AddModalForm>
      </React.Fragment>
    )
  }
  onSubmit = (event: React.FormEvent<{}>) => {
    event.preventDefault()
    if (this.state.selected === undefined) {
      return
    }
    const update: Partial<PickUpLocationDocument> = {
      synonyms: this.state.selected.synonyms.concat(this.props.synonym),
    }
    console.log(update, this.state.selected)
    firestore
      .collection(Collections.PickupLocations)
      .doc(this.state.selected.id)
      .update(update)
      .then(() => this.setState(() => initialState))
  }
}
