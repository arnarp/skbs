import * as React from 'react'
import { Button } from '../../shared/components/Button'
import { LinkIcon } from '../../shared/icons/LinkIcon'
import { Tour, TourDocument } from '../../shared/types/Tour'
import { ModalForm } from '../../shared/components/ModalForm'
import { firestore } from '../../firebase'

type LinkTourModalButtonProps = {
  tours: Tour[]
  synonym: string
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
          <LinkIcon color="munsell" size="small" />
        </Button>
        <ModalForm
          show={this.state.show}
          onClose={() => this.setState(() => initialState)}
          focusAfterClose={() => this.btn && this.btn.focus()}
          header="Link tour"
          submitBtnLabel="Link tour"
          onSubmit={this.onSubmit}
          submitDisabled={this.state.selected === undefined}
        >
          <p>Link {this.props.synonym} to</p>
          <label>
            Choose tour
            <select
              value={this.state.selected === undefined ? '' : this.state.selected.id}
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
      .collection('tours')
      .doc(this.state.selected.id)
      .update(update)
      .then(() => this.setState(() => initialState))
  }
}
