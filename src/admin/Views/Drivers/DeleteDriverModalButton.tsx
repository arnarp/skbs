import * as React from "react";
import { IconButton } from "../../../shared/components/IconButton";
import { DeleteIcon } from "../../../shared/icons/DeleteIcon";
import { ConfirmationModal } from "../../../shared/components/ConfirmationModal";
import { Driver } from "../../../shared/types/Driver";
import { deleteDriver } from "../../../firebase/firestore/drivers";
import { logger } from "../../../shared/utils/breadcrumb";

export const DeleteDriverModalButton: React.SFC<{
  driver: Driver;
}> = ({ driver }) => {
  const [show, setShow] = React.useState(false);
  const triggerBtn = React.useRef<HTMLButtonElement>(null);
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
          setShow(false);
          deleteDriver({
            driverId: driver.id,
            onSuccess: () => {
              logger("Driver deleted", "info", driver);
            },
            onReject: reason => {
              logger("Delete driver error", "error", reason);
            }
          });
        }}
        focusAfterClose={() => {
          console.log("focusAfterClose", triggerBtn.current);
          triggerBtn.current && triggerBtn.current.focus();
        }}
        header="Delete driver"
      >
        <p>Please confirm deleting driver {driver.name}</p>
      </ConfirmationModal>
    </React.Fragment>
  );
};
