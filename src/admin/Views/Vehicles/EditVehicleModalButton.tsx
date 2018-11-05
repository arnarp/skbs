import * as React from "react"
import { Vehicle } from "../../../shared/types/Vehicle"
import {
  useTextInput,
  useNumberInput,
} from "../../../shared/hooks/useTextInput"
import { updateVehicle } from "../../../firebase/firestore/vehicles"
import { logger } from "../../../shared/utils/breadcrumb"
import { IconButton } from "../../../shared/components/IconButton"
import { EditIcon } from "../../../shared/icons/EditIcon"
import { ModalForm } from "../../../shared/components/ModalForm"

export const EditVehicleModalButton: React.SFC<{ vehicle: Vehicle }> = ({
  vehicle,
}) => {
  const [showModal, setShowModal] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)
  const [submitError, setSubmitError] = React.useState<string | undefined>(
    undefined,
  )
  const button = React.useRef<HTMLButtonElement>()
  const [name, setName, nameInputProps] = useTextInput(vehicle.name)
  const [maxPax, setMaxPax, maxPaxInputProps] = useNumberInput(vehicle.maxPax)

  const onSubmit = (event: React.FormEvent<{}>) => {
    event.preventDefault()
    setSubmitting(true)
    setSubmitError(undefined)
    updateVehicle({
      vehicleId: vehicle.id,
      update: {
        name,
        maxPax,
      },
      onSuccess: () => {
        setSubmitting(false)
        setShowModal(false)
      },
      onReject: reason => {
        setSubmitting(false)
        setSubmitError(reason.message)
        logger("Update vehicle error", "error", reason)
      },
    })
  }

  const onOpenModalClick = () => {
    setShowModal(true)
    setSubmitError(undefined)
    setName(vehicle.name)
    setMaxPax(vehicle.maxPax)
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
        header={`Edit vehicle ${vehicle.name}`}
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
          Max Pax
          <input {...maxPaxInputProps} />
        </label>
      </ModalForm>
    </React.Fragment>
  )
}
