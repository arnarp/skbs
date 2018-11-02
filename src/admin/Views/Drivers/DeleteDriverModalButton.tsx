import * as React from "react"
import { IconButton } from "../../../shared/components/IconButton"
import { DeleteIcon } from "../../../shared/icons/DeleteIcon"
import { ConfirmationModal } from "../../../shared/components/ConfirmationModal"
import { Driver } from "../../../shared/types/Driver"
import { deleteDriver } from "../../../firebase/firestore/drivers"
import { breadcrumb } from "../../../shared/utils/breadcrumb"

type Props = {
  driver: Driver
}

export const DeleteDriverModalButton: React.SFC<Props> = ({ driver }) => {
  const [show, setShow] = React.useState(false)
  const triggerBtn = React.useRef<HTMLButtonElement>()
  return (
    <React.Fragment>
      <IconButton ref={triggerBtn} onClick={() => setShow(true)}>
        <DeleteIcon color="tangerine" size="small" />
      </IconButton>
      <ConfirmationModal
        show={show}
        onClose={() => setShow(false)}
        onConfirmed={() => {
          setShow(false)
          deleteDriver({
            driverId: driver.id,
            onSuccess: () => {
              breadcrumb("Driver deleted", "info", driver)
            },
            onReject: reason => {
              breadcrumb("Delete driver error", "error", reason)
            },
          })
        }}
        focusAfterClose={() => {
          console.log("focusAfterClose", triggerBtn.current)
          triggerBtn.current && triggerBtn.current.focus()
        }}
        header="Delete driver"
      >
        <p>Please confirm deleting driver {driver.name}</p>
      </ConfirmationModal>
    </React.Fragment>
  )
}
