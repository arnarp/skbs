import * as React from "react";
import { Vehicle } from "../../../shared/types/Vehicle";
import { IconButton } from "../../../shared/components/IconButton";
import { DeleteIcon } from "../../../shared/icons/DeleteIcon";
import { ConfirmationModal } from "../../../shared/components/ConfirmationModal";
import { deleteVehicle } from "../../../firebase/firestore/vehicles";
import { logger } from "../../../shared/utils/breadcrumb";

export const DeleteVehicleModalButton: React.SFC<{
  vehicle: Vehicle;
}> = ({ vehicle }) => {
  const [show, setShow] = React.useState(false);
  const trigger = React.useRef<HTMLButtonElement>(null);
  return (
    <React.Fragment>
      <IconButton
        ref={trigger}
        onClick={() => setShow(true)}
        color="tangerine"
        Icon={DeleteIcon}
      />
      <ConfirmationModal
        show={show}
        onClose={() => setShow(false)}
        onConfirmed={() => {
          setShow(false);
          deleteVehicle({
            vehicleId: vehicle.id,
            onSuccess: () => {
              logger("Vehicle deleted", "info", vehicle);
            },
            onReject: reason => {
              logger("Vehicle delete error", "error", reason);
            }
          });
        }}
        focusAfterClose={() => {
          trigger.current && trigger.current.focus();
        }}
        header={`Delete vehicle`}
      >
        <p>Confirm deleting vehicle {vehicle.name}</p>
      </ConfirmationModal>
    </React.Fragment>
  );
};
