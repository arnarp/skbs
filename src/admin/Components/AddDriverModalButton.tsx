import * as React from "react"
import { Button } from "../../shared/components/Button"
import { ModalForm } from "../../shared/components/ModalForm"
import { DriverDocument } from "../../shared/types/Driver"
import { useTextInput } from "../../shared/hooks/useTextInput"
import { addNewDriver } from "../../firebase/firestore/drivers";
import { breadcrumb } from "../../shared/utils/breadcrumb";

export const AddDriverModalButton: React.SFC<{}> = () => {
  const [showModal, setShowModal] = React.useState(false)
  const triggerButton = React.useRef<HTMLButtonElement>()
  const [name, setName, nameInputProps] = useTextInput("")
  const [phoneNumber, setPhoneNumber, phoneNumberInputProps] = useTextInput("")
  const [submitError, setSubmitError] = React.useState<string | undefined>(undefined)

  const onSubmit = (event: React.FormEvent<{}>) => {
    event.preventDefault()
    const newDriverDoc: DriverDocument = {
      name,
      phoneNumber,
      status: "active",
    }
    addNewDriver({
      newDriverDoc,
      onSuccess: setInitialState,
      onReject: reason => {
        setSubmitError(reason.message)
        breadcrumb("Create new driver error", "error", reason)
      }
    })
  }
  const setInitialState = () => {
    setShowModal(false)
    setName("")
    setPhoneNumber("")
    setSubmitError(undefined)
  }
  return (
    <React.Fragment>
      <Button
        color="default"
        style="flat"
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
      </ModalForm>
    </React.Fragment>
  )
}


