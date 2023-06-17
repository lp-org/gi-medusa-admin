import { useMutation } from "@tanstack/react-query"
import React from "react"
import { useForm } from "react-hook-form"
import useNotification from "../../../hooks/use-notification"
import { getErrorMessage } from "../../../utils/error-messages"
import Button from "../../fundamentals/button"

import Modal from "../../molecules/modal"
import api from "../../../services/api"
import Checkbox from "../../atoms/checkbox"
import Accordion from "../accordion"

type ModalProps = {
  handleClose: () => void
}
type AddRoleModalFormData = {
  name: string
}

const PermissionModal: React.FC<ModalProps> = ({ handleClose }) => {
  const notification = useNotification()
  const { mutate, isLoading } = useMutation({
    mutationFn: api.roles.add,
    onSuccess: () => {
      notification("Success", `Role added`, "success")
      handleClose()
    },
    onError: (error) => {
      notification("Error", getErrorMessage(error), "error")
    },
  })
  const { control, register, handleSubmit } = useForm<AddRoleModalFormData>()
  const onSubmit = (data: AddRoleModalFormData) => {
    mutate(data)
  }
  return (
    <div>
      <Modal handleClose={handleClose}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body>
            <Modal.Header handleClose={handleClose}>
              <span className="inter-xlarge-semibold">Set permissions</span>
            </Modal.Header>
            <Modal.Content>
              <div className="flex flex-col gap-y-base">
                <Accordion type="multiple">
                  <Accordion.Item
                    title={
                      <>
                        <Checkbox label="Product" />
                      </>
                    }
                    value="item-1"
                  >
                    <Checkbox label="add" />
                  </Accordion.Item>
                </Accordion>
              </div>
            </Modal.Content>
            <Modal.Footer>
              <div className="flex h-8 w-full justify-end">
                <Button
                  variant="ghost"
                  className="mr-2 w-32 justify-center text-small"
                  size="large"
                  type="button"
                  onClick={handleClose}
                >
                  Cancel
                </Button>
                <Button
                  loading={isLoading}
                  disabled={isLoading}
                  size="large"
                  className="w-32 justify-center text-small"
                  variant="primary"
                >
                  Save
                </Button>
              </div>
            </Modal.Footer>
          </Modal.Body>
        </form>
      </Modal>
    </div>
  )
}

export default PermissionModal
