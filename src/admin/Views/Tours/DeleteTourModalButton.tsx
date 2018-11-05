import * as React from "react"
import { IconButton } from "../../../shared/components/IconButton"
import { DeleteIcon } from "../../../shared/icons/DeleteIcon"
import { ConfirmationModal } from "../../../shared/components/ConfirmationModal"
import { logger } from "../../../shared/utils/breadcrumb"
import { Tour } from "../../../shared/types/Tour"
import { deleteTour } from "../../../firebase/firestore/tours"

export const DeleteTourModalButton: React.SFC<{
  tour: Tour
}> = ({ tour }) => {
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
          deleteTour({
            tourId: tour.id,
            onSuccess: () => {
              logger("Tour deleted", "info", tour)
            },
            onReject: reason => {
              logger("Delete tour error", "error", reason)
            },
          })
        }}
        focusAfterClose={() => {
          console.log("focusAfterClose", triggerBtn.current)
          triggerBtn.current && triggerBtn.current.focus()
        }}
        header="Delete tour"
      >
        <p>Please confirm deleting tour {tour.name}</p>
      </ConfirmationModal>
    </React.Fragment>
  )
}
