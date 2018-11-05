import * as React from "react"
import randomColor = require("randomcolor")
import { Button } from "../../../shared/components/Button"
import { ModalForm } from "../../../shared/components/ModalForm"
import { TourDocument } from "../../../shared/types/Tour"
import { useTextInput } from "../../../shared/hooks/useTextInput"
import { addNewTour } from "../../../firebase/firestore/tours"
import { logger } from "../../../shared/utils/breadcrumb"

export const AddTourModalButton = () => {
  const btn = React.useRef<HTMLButtonElement>()
  const [showModal, setShowModal] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)
  const [name, setName, nameInputProps] = useTextInput("")
  const [submitError, setSubmitError] = React.useState<string | undefined>(
    undefined,
  )
  const [color, setColor] = React.useState(randomColor())

  const onSubmit = (event: React.FormEvent<{}>) => {
    event.preventDefault()
    setSubmitting(true)
    const newTourDoc: TourDocument = {
      name,
      synonyms: [],
      color,
    }
    addNewTour({
      newTourDoc,
      onSuccess: () => {
        setShowModal(false)
        setSubmitting(false)
      },
      onReject: reason => {
        setSubmitError(reason.message)
        setSubmitting(false)
        logger("Create new tour error", "error", reason)
      },
    })
  }

  return (
    <React.Fragment>
      <Button
        color="default"
        ref={btn}
        onClick={() => {
          setColor(randomColor())
          setName("")
          setShowModal(true)
        }}
      >
        Add tour
      </Button>
      <ModalForm
        onSubmit={onSubmit}
        show={showModal}
        onClose={() => setShowModal(false)}
        focusAfterClose={() => btn.current && btn.current.focus()}
        header="Add new tour"
        submitBtnLabel="Add tour"
        submitError={submitError}
        submitDisabled={submitting}
      >
        <label>
          Name
          <input {...nameInputProps} />
        </label>
        <label>
          color
          <input
            type="color"
            value={color}
            onChange={event => {
              const color = event.target.value
              setColor(color)
            }}
          />
          <Button color="default" onClick={() => setColor(randomColor())}>
            Random
          </Button>
        </label>
      </ModalForm>
    </React.Fragment>
  )
}
