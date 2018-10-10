import * as React from 'react'
import { Modal } from '../Modal'
import './AddModalForm.css'
import { Button } from '../Button'

type AddModalProps = {
  show: boolean
  onClose: () => void
  focusAfterClose: () => void
  onSubmit: (event: React.FormEvent<{}>) => void
  header: string
  submitBtnLabel: string
  submitDisabled: boolean
}

const initialState = {}
type AddModalState = Readonly<typeof initialState>

export class AddModalForm extends React.PureComponent<AddModalProps, AddModalState> {
  readonly state: AddModalState = initialState
  static defaultProps = {
    submitDisabled: false
  }
  render() {
    return (
      <Modal
        show={this.props.show}
        onClose={this.props.onClose}
        focusAfterClose={this.props.focusAfterClose}
        header={this.props.header}
      >
        <form onSubmit={this.props.onSubmit} className="AddModalForm">
          {this.props.children}
          <div>
            <Button type="submit" color="primary" style="flat" disabled={this.props.submitDisabled}>
              {this.props.submitBtnLabel}
            </Button>
          </div>
        </form>
      </Modal>
    )
  }
}
