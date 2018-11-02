import * as React from "react"
import { EditIcon } from "../../../shared/icons/EditIcon"
import { ModalForm } from "../../../shared/components/ModalForm"
import { IconButton } from "../../../shared/components/IconButton/IconButton"
import { Driver } from "../../../shared/types/Driver"
import { useTextInput } from "../../../shared/hooks/useTextInput"
import { updateDriver } from "../../../firebase/firestore/drivers"
import { breadcrumb } from "../../../shared/utils/breadcrumb"

type Props = {
  driver: Driver
}

export const EditDriverModalButton: React.SFC<Props> = ({ driver }) => {
  const [showModal, setShowModal] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)
  const [submitError, setSubmitError] = React.useState<string | undefined>(undefined)
  const button = React.useRef<HTMLButtonElement>()
  const [name, setName, nameInputProps] = useTextInput(driver.name)
  const [phoneNumber, setPhoneNr, phoneNrInputProps] = useTextInput(driver.phoneNumber || "")
  const onSubmit = (event: React.FormEvent<{}>) => {
    event.preventDefault()
    setSubmitting(true)
    updateDriver({
      driverId: driver.id,
      update: {
        name,
        phoneNumber,
      },
      onSuccess: () => {
        setSubmitting(false)
        setShowModal(false)
      },
      onReject: reason => {
        setSubmitting(false)
        setSubmitError(reason.message)
        breadcrumb("Update driver error", "error", reason)
      },
    })
  }
  const onOpenModalClick = () => {
    setShowModal(true)
    setName(driver.name)
    setPhoneNr(driver.phoneNumber || "")
  }

  return (
    <React.Fragment>
      <IconButton ref={button} onClick={onOpenModalClick}>
        <EditIcon color="munsell" size="small" />
      </IconButton>
      <ModalForm
        show={showModal}
        onClose={() => setShowModal(false)}
        focusAfterClose={() => button.current && button.current.focus()}
        header="Edit driver"
        submitBtnLabel="Submit changes"
        onSubmit={onSubmit}
        submitDisabled={submitting}
        submitError={submitError}
      >
        <label>
          Name
          <input {...nameInputProps} />
        </label>
        <label>
          Phone nr.
          <input {...phoneNrInputProps} />
        </label>
      </ModalForm>
    </React.Fragment>
  )
}
