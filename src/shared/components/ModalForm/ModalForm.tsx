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
  submitDisabled?: boolean
  submitError?: string
}

export const ModalForm: React.SFC<Props> = ({
  show,
  onClose,
  focusAfterClose,
  onSubmit,
  header,
  submitBtnLabel,
  submitError,
  children,
  submitDisabled = false,
}) => {
  return (
    <Modal
      show={show}
      onClose={onClose}
      focusAfterClose={focusAfterClose}
      header={header}
    >
      <form onSubmit={onSubmit} className="ModalForm">
        {children}
        <div className="buttonRow">
          <span className="submitError">
            {submitError && `Error: ${submitError}`}
          </span>
          <Button
            type="submit"
            color="munsell"
            disabled={submitDisabled}
          >
            {submitBtnLabel}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
