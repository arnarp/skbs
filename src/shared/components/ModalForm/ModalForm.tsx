import * as React from "react"
import { Modal } from "../Modal"
import "./ModalForm.css"
import { Button } from "../Button"

type Props = {
  show: boolean
  onClose: () => void
  focusAfterClose: () => void
  onSubmit: (event: React.FormEvent<{}>) => void
  header: string
  submitBtnLabel: string
  submitDisabled: boolean
  formClassName?: string
  submitError?: string
}

const initialState = {}
type State = Readonly<typeof initialState>

export class ModalForm extends React.PureComponent<Props, State> {
  readonly state: State = initialState
  static defaultProps = {
    submitDisabled: false,
  }
  render() {
    return (
      <Modal
        show={this.props.show}
        onClose={this.props.onClose}
        focusAfterClose={this.props.focusAfterClose}
        header={this.props.header}
      >
        <form onSubmit={this.props.onSubmit} className="ModalForm">
          {this.props.children}
          <div className="buttonRow">
            <span className="submitError">
              {this.props.submitError && `Error: ${this.props.submitError}`}
            </span>
            <Button type="submit" color="munsell" style="flat" disabled={this.props.submitDisabled}>
              {this.props.submitBtnLabel}
            </Button>
          </div>
        </form>
      </Modal>
    )
  }
}
