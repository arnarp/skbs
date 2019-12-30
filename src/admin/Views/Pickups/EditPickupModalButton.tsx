import * as React from "react";
import { EditIcon } from "../../../shared/icons/EditIcon";
import { ModalForm } from "../../../shared/components/ModalForm";
import { IconButton } from "../../../shared/components/IconButton/IconButton";
import { useTextInput } from "../../../shared/hooks/useTextInput";
import { logger } from "../../../shared/utils/breadcrumb";
import { PickUpLocation } from "../../../shared/types/PickUpLocation";
import { updatePickup } from "../../../firebase/firestore/pickups";

export const EditPickupModalButton: React.SFC<{ pickup: PickUpLocation }> = ({
  pickup
}) => {
  const [showModal, setShowModal] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | undefined>(
    undefined
  );
  const button = React.useRef<HTMLButtonElement>(null);
  const [name, setName, nameInputProps] = useTextInput(pickup.name);
  const onSubmit = (event: React.FormEvent<{}>) => {
    event.preventDefault();
    setSubmitting(true);
    setSubmitError(undefined);
    updatePickup({
      pickupId: pickup.id,
      update: {
        name
      },
      onSuccess: () => {
        setSubmitting(false);
        setShowModal(false);
      },
      onReject: reason => {
        setSubmitting(false);
        setSubmitError(reason.message);
        logger("Update pickup error", "error", reason);
      }
    });
  };
  const onOpenModalClick = () => {
    setShowModal(true);
    setSubmitError(undefined);
    setName(pickup.name);
  };

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
        header={`Edit pickup ${pickup.name}`}
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
  );
};
