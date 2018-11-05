import * as React from "react"
import { EditIcon } from "../../../shared/icons/EditIcon"
import { ModalForm } from "../../../shared/components/ModalForm"
import { IconButton } from "../../../shared/components/IconButton/IconButton"
import { useTextInput } from "../../../shared/hooks/useTextInput"
import { logger } from "../../../shared/utils/breadcrumb"
import { Tour } from "../../../shared/types/Tour";
import { updateTour } from "../../../firebase/firestore/tours";

export const EditTourModalButton: React.SFC<{
  tour: Tour
}> = ({ tour }) => {
  const [showModal, setShowModal] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)
  const [submitError, setSubmitError] = React.useState<string | undefined>(
    undefined,
  )
  const button = React.useRef<HTMLButtonElement>()
  const [name, setName, nameInputProps] = useTextInput(tour.name)
  
  const onSubmit = (event: React.FormEvent<{}>) => {
    event.preventDefault()
    setSubmitting(true)
    setSubmitError(undefined)
    updateTour({
      tourId: tour.id,
      update: {
        name,
      },
      onSuccess: () => {
        setSubmitting(false)
        setShowModal(false)
      },
      onReject: reason => {
        setSubmitting(false)
        setSubmitError(reason.message)
        logger("Update tour error", "error", reason)
      },
    })
  }
  const onOpenModalClick = () => {
    setShowModal(true)
    setSubmitError(undefined)
    setName(tour.name)
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
        header={`Edit tour ${tour.name}`}
        submitBtnLabel="Submit changes"
        onSubmit={onSubmit}
        submitDisabled={submitting}
        submitError={submitError}
      >
        <label>
          Name
          <input {...nameInputProps} />
        </label>
      </ModalForm>
    </React.Fragment>
  )
}
