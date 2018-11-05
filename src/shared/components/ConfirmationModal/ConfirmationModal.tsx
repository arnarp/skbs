import * as React from "react"
import "./ConfirmationModal.css"
import { Modal } from "../Modal"
import { Button } from "../Button"
import "./ConfirmationModal.css"

type Props = {
  show: boolean
  onClose: () => void
  onConfirmed: () => void
  focusAfterClose: () => void
  header: string
  cancelBtnLabel?: string
  confirmBtnLabel?: string
}

export const ConfirmationModal: React.SFC<Props> = ({
  show,
  onClose,
  onConfirmed,
  focusAfterClose,
  header,
  children,
  cancelBtnLabel = "Cancel",
  confirmBtnLabel = "Confirm",
}) => {
  return (
    <Modal
      show={show}
      onClose={onClose}
      focusAfterClose={focusAfterClose}
      header={header}
    >
      <div className="ConfirmationModal">
        {children}
        <div className="buttonRow">
          <Button color="default" onClick={onClose}>
            {cancelBtnLabel}
          </Button>
          <Button color="default" onClick={onConfirmed}>
            {confirmBtnLabel}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
