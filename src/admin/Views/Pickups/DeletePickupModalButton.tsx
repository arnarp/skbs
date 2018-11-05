import * as React from "react"
import { IconButton } from "../../../shared/components/IconButton"
import { DeleteIcon } from "../../../shared/icons/DeleteIcon"
import { ConfirmationModal } from "../../../shared/components/ConfirmationModal"
import { logger } from "../../../shared/utils/breadcrumb"
import { PickUpLocation } from "../../../shared/types/PickUpLocation"
import { deletePickup } from "../../../firebase/firestore/pickups"

export const DeletePickupModalButton: React.SFC<{
  pickup: PickUpLocation
}> = ({ pickup }) => {
  const [show, setShow] = React.useState(false)
  const triggerBtn = React.useRef<HTMLButtonElement>()
  return (
    <React.Fragment>
      <IconButton
        ref={triggerBtn}
        onClick={() => setShow(true)}
        color="tangerine"
        Icon={DeleteIcon}
      />
      <ConfirmationModal
        show={show}
        onClose={() => setShow(false)}
        onConfirmed={() => {
          setShow(false)
          deletePickup({
            pickupId: pickup.id,
            onSuccess: () => {
              logger("Pickup deleted", "info", pickup)
            },
            onReject: reason => {
              logger("Delete pickup error", "error", reason)
            },
          })
        }}
        focusAfterClose={() => {
          console.log("focusAfterClose", triggerBtn.current)
          triggerBtn.current && triggerBtn.current.focus()
        }}
        header="Delete pickup"
      >
        <p>Please confirm deleting pickup {pickup.name}</p>
      </ConfirmationModal>
    </React.Fragment>
  )
}
