import * as React from 'react'
import { LinkIcon } from '../../../shared/icons/LinkIcon'
import { ModalForm } from '../../../shared/components/ModalForm'
import { firestore } from '../../../firebase'
import { PickUpLocation, PickUpLocationDocument } from '../../../shared/types/PickUpLocation'
import { Collections } from '../../../shared/constants'
import { MainColor } from '../../../shared/icons/IconProps';
import { IconButton } from '../../../shared/components/IconButton';

type LinkPickupLocModalButtonProps = {
  pickupLocations: PickUpLocation[]
  synonym: string
  color: MainColor
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
  btn = React.createRef<HTMLButtonElement>()

  render() {
    return (
      <React.Fragment>
        <IconButton
          ref={this.btn}
          color={this.props.color}
          onClick={() => this.setState(() => ({ show: true }))}
          Icon={LinkIcon}
        />
        <ModalForm
          show={this.state.show}
          onClose={() => this.setState(() => initialState)}
          focusAfterClose={() => this.btn.current && this.btn.current.focus()}
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
        </ModalForm>
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
