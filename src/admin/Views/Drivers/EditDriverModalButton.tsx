import * as React from "react"
import { EditIcon } from "../../../shared/icons/EditIcon"
import { ModalForm } from "../../../shared/components/ModalForm"
import { IconButton } from "../../../shared/components/IconButton/IconButton"
import { Driver } from "../../../shared/types/Driver"
import { useTextInput } from "../../../shared/hooks/useTextInput"
import { updateDriver } from "../../../firebase/firestore/drivers"
import { logger } from "../../../shared/utils/breadcrumb"
import { useState } from "react";

export const EditDriverModalButton: React.SFC<{
  driver: Driver
}> = ({ driver }) => {
  const [showModal, setShowModal] = useState(false)
  const [submitting, setSubmitting] = React.useState(false)
  const [submitError, setSubmitError] = React.useState<string | undefined>(
    undefined,
  )
  const button = React.useRef<HTMLButtonElement>()
  const [name, setName, nameInputProps] = useTextInput(driver.name)
  const [phoneNumber, setPhoneNr, phoneNrInputProps] = useTextInput(
    driver.phoneNumber || "",
  )
  const onSubmit = (event: React.FormEvent<{}>) => {
    event.preventDefault()
    setSubmitting(true)
    setSubmitError(undefined)
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
        logger("Update driver error", "error", reason)
      },
    })
  }
  const onOpenModalClick = () => {
    setShowModal(true)
    setSubmitError(undefined)
    setName(driver.name)
    setPhoneNr(driver.phoneNumber || "")
  }

  return (
    <React.Fragment>
      <IconButton
        ref={button}
        onClick={onOpenModalClick}
        color="munsell"
        Icon={EditIcon}
      />
      <ModalForm
        show={showModal}
        onClose={() => setShowModal(false)}
        focusAfterClose={() => button.current && button.current.focus()}
        header={`Edit driver ${driver.name}`}
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
