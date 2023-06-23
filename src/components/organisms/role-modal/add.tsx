import { Select } from "@radix-ui/react-select"
import React from "react"
import { Controller, useForm } from "react-hook-form"
import Button from "../../fundamentals/button"
import InputField from "../../molecules/input"
import Modal from "../../molecules/modal"
import { useMutation } from "@tanstack/react-query"
import api from "../../../services/api"
import useNotification from "../../../hooks/use-notification"
import { getErrorMessage } from "../../../utils/error-messages"
import { queryClient } from "../../../constants/query-client"

type ModalProps = {
  payloadData?: any
  handleClose: () => void
}
type AddRoleModalFormData = {
  id?: string
  name: string
}

const AddRoleModal: React.FC<ModalProps> = ({ payloadData, handleClose }) => {
  const notification = useNotification()
  const { mutate, isLoading } = useMutation({
    mutationFn: payloadData ? api.roles.update : api.roles.add,
    onSuccess: () => {
      notification(
        "Success",
        payloadData ? `Role updated` : `Role added`,
        "success"
      )
      queryClient.invalidateQueries({ queryKey: ["roleList"] })
      handleClose()
    },
    onError: (error) => {
      notification("Error", getErrorMessage(error), "error")
    },
  })
  const { register, handleSubmit } = useForm<AddRoleModalFormData>({
    defaultValues: payloadData || {},
  })
  const onSubmit = (data: AddRoleModalFormData) => {
    const { id, name } = data
    payloadData ? mutate({ roleId: id, data: { name } }) : mutate(data)
  }
  return (
    <div>
      <Modal handleClose={handleClose}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body>
            <Modal.Header handleClose={handleClose}>
              <span className="inter-xlarge-semibold">
                {payloadData ? "Edit role" : "Add new role"}
              </span>
            </Modal.Header>
            <Modal.Content>
              <div className="flex flex-col gap-y-base">
                <InputField
                  label="Name"
                  placeholder="Admin"
                  required
                  {...register("name", { required: true })}
                />
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

export default AddRoleModal
