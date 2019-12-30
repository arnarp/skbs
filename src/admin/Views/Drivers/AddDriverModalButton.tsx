import * as React from "react";
import { Button } from "../../../shared/components/Button";
import { ModalForm } from "../../../shared/components/ModalForm";
import { DriverDocument } from "../../../shared/types/Driver";
import { useTextInput } from "../../../shared/hooks/useTextInput";
import { addNewDriver } from "../../../firebase/firestore/drivers";
import { logger } from "../../../shared/utils/breadcrumb";

export const AddDriverModalButton = () => {
  const [showModal, setShowModal] = React.useState(false);
  const triggerButton = React.useRef<HTMLButtonElement>(null);
  const [name, setName, nameInputProps] = useTextInput("");
  const [phoneNumber, setPhoneNumber, phoneNumberInputProps] = useTextInput("");
  const [email, setEmail, emailInputProps] = useTextInput("");
  const [submitError, setSubmitError] = React.useState<string | undefined>(
    undefined
  );

  const onSubmit = (event: React.FormEvent<{}>) => {
    event.preventDefault();
    const newDriverDoc: DriverDocument = {
      name,
      phoneNumber,
      email,
      status: "active"
    };
    addNewDriver({
      newDriverDoc,
      onSuccess: setInitialState,
      onReject: reason => {
        setSubmitError(reason.message);
        logger("Create new driver error", "error", reason);
      }
    });
  };
  const setInitialState = () => {
    setShowModal(false);
    setName("");
    setPhoneNumber("");
    setEmail("");
    setSubmitError(undefined);
  };
  return (
    <React.Fragment>
      <Button
        color="default"
        ref={triggerButton}
        onClick={() => setShowModal(true)}
      >
        Add driver
      </Button>
      <ModalForm
        onSubmit={onSubmit}
        show={showModal}
        onClose={setInitialState}
        focusAfterClose={() =>
          triggerButton.current && triggerButton.current.focus()
        }
        header="Add new driver"
        submitBtnLabel="Add driver"
        submitError={submitError}
      >
        <label>
          Name
          <input {...nameInputProps} />
        </label>
        <label>
          Phone nr
          <input {...phoneNumberInputProps} />
        </label>
        <label>
          Email
          <input {...emailInputProps} />
        </label>
      </ModalForm>
    </React.Fragment>
  );
};
