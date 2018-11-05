import * as React from "react"
import { LinkIcon } from "../../../shared/icons/LinkIcon"
import { Tour, TourDocument } from "../../../shared/types/Tour"
import { ModalForm } from "../../../shared/components/ModalForm"
import { firestore } from "../../../firebase"
import { IconButton } from "../../../shared/components/IconButton"
import { MainColor } from "../../../shared/icons/IconProps"

type LinkTourModalButtonProps = {
  tours: Tour[]
  synonym: string
  color: MainColor
}

const initialState = {
  show: false,
  selected: undefined as Tour | undefined,
}
type LinkTourModalButtonState = Readonly<typeof initialState>

export class LinkTourModalButton extends React.PureComponent<
  LinkTourModalButtonProps,
  LinkTourModalButtonState
> {
  readonly state: LinkTourModalButtonState = initialState
  btn = React.createRef<HTMLButtonElement>()

  render() {
    return (
      <React.Fragment>
        <IconButton
          ref={this.btn}
          color={this.props.color}
          Icon={LinkIcon}
          onClick={() => this.setState(() => ({ show: true }))}
        />
        <ModalForm
          show={this.state.show}
          onClose={() => this.setState(() => initialState)}
          focusAfterClose={() => this.btn.current && this.btn.current.focus()}
          header="Link tour"
          submitBtnLabel="Link tour"
          onSubmit={this.onSubmit}
          submitDisabled={this.state.selected === undefined}
        >
          <p>Link {this.props.synonym} to</p>
          <label>
            Choose tour
            <select
              value={
                this.state.selected === undefined ? "" : this.state.selected.id
              }
              onChange={event => {
                const selectedId = event.target.value
                const selected = this.props.tours.find(i => i.id === selectedId)
                this.setState(() => ({ selected }))
              }}
            >
              <option value=""> - Choose tour - </option>
              {this.props.tours.map(d => (
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
    const update: Partial<TourDocument> = {
      synonyms: this.state.selected.synonyms.concat(this.props.synonym),
    }
    console.log(update, this.state.selected)
    firestore
      .collection("tours")
      .doc(this.state.selected.id)
      .update(update)
      .then(() => this.setState(() => initialState))
  }
}
