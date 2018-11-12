import * as React from "react"
import { IconButton } from "../../../shared/components/IconButton"
import { DeleteIcon } from "../../../shared/icons/DeleteIcon"
import { ConfirmationModal } from "../../../shared/components/ConfirmationModal"
import { logger } from "../../../shared/utils/breadcrumb"
import { Group } from "../../../shared/types/Group"
import { deleteGroup } from "../../../firebase/firestore/groups"

export const DeleteGroupButton = ({ group }: { group: Group }) => {
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
          deleteGroup({
            groupId: group.id,
            onSuccess: () => {
              logger("Group deleted", "info", group)
            },
            onReject: reason => {
              logger("Delete group error", "error", reason)
            },
          })
        }}
        focusAfterClose={() => {
          console.log("focusAfterClose", triggerBtn.current)
          triggerBtn.current && triggerBtn.current.focus()
        }}
        header={`Delete group ${group.friendlyKey}`}
      >
        <p>Please confirm deleting group {group.friendlyKey}</p>
      </ConfirmationModal>
    </React.Fragment>
  )
}
