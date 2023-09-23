import { User } from "@medusajs/medusa"
import { useAdminUpdateUser } from "medusa-react"
import React, { useEffect, useMemo } from "react"
import { Controller, useForm } from "react-hook-form"

import { useTranslation } from "react-i18next"
import useNotification from "../../../hooks/use-notification"
import { getErrorMessage } from "../../../utils/error-messages"
import FormValidator from "../../../utils/form-validator"
import Button from "../../fundamentals/button"
import InputField from "../../molecules/input"
import Modal from "../../molecules/modal"
import { useMutation, useQuery } from "@tanstack/react-query"
import api from "../../../services/api"
import Select from "../../molecules/select"
import { Role } from "../../../types/shared"
import { Link, NavLink } from "react-router-dom"

type EditUserModalProps = {
  handleClose: () => void
  user: User
  onSuccess: () => void
}

type EditUserModalFormData = {
  first_name: string
  last_name: string
  role: Role
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  handleClose,
  user,
  onSuccess,
}) => {
  const { mutate, isLoading } = useMutation({ mutationFn: api.users.update })
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<EditUserModalFormData>()
  const notification = useNotification()
  const { t } = useTranslation()

  useEffect(() => {
    reset(mapUser)
  }, [user])

  const onSubmit = (data: EditUserModalFormData) => {
    const { role, ...payload } = data
    mutate(
      { userId: user.id, data: { ...payload, role_id: role.value } },
      {
        onSuccess: () => {
          notification("Success", `User was updated`, "success")
          onSuccess()
        },
        onError: (error) => {
          notification("Error", getErrorMessage(error), "error")
        },
        onSettled: () => {
          handleClose()
        },
      }
    )
    mutate(data, {
      onSuccess: () => {
        notification(
          t("edit-user-modal-success", "Success"),
          t("edit-user-modal-user-was-updated", "User was updated"),
          "success"
        )
        onSuccess()
      },
      onError: (error) => {
        notification(
          t("edit-user-modal-error", "Error"),
          getErrorMessage(error),
          "error"
        )
      },
      onSettled: () => {
        handleClose()
      },
    })
  }
  const { data } = useQuery({
    queryFn: () => api.roles.list(),
    queryKey: ["roleList"],
  })

  const roleOptions = useMemo(() => {
    const list = data?.data.data
    return list ? list.map((el) => ({ value: el.id, label: el.name })) : []
  }, [data])
  const mapUser: EditUserModalFormData = useMemo(() => {
    const selectedRole = roleOptions.find((el) => el.value === user.role_id)

    return {
      first_name: user.first_name,
      last_name: user.last_name,
      role: selectedRole,
    }
  }, [roleOptions, user])
  return (
    <Modal handleClose={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <Modal.Header handleClose={handleClose}>
            <span className="inter-xlarge-semibold">
              {t("edit-user-modal-edit-user", "Edit User")}
            </span>
          </Modal.Header>
          <Modal.Content>
            <div className="mb-base grid w-full grid-cols-2 gap-large">
              <InputField
                label={t("edit-user-modal-first-name-label", "First Name")}
                placeholder={t(
                  "edit-user-modal-first-name-placeholder",
                  "First name..."
                )}
                required
                {...register("first_name", {
                  required: FormValidator.required("First name"),
                  pattern: FormValidator.whiteSpaceRule("First name"),
                  minLength: FormValidator.minOneCharRule("First name"),
                })}
                errors={errors}
              />
              <InputField
                label={t("edit-user-modal-last-name-label", "Last Name")}
                placeholder={t(
                  "edit-user-modal-last-name-placeholder",
                  "Last name..."
                )}
                required
                {...register("last_name", {
                  required: FormValidator.required("Last name"),
                  pattern: FormValidator.whiteSpaceRule("Last name"),
                  minLength: FormValidator.minOneCharRule("last name"),
                })}
                errors={errors}
              />
              <Controller
                name="role"
                control={control}
                render={({ field: { value, onChange } }) => {
                  return (
                    <Select
                      label="Role"
                      onChange={onChange}
                      options={roleOptions}
                      value={value}
                    />
                  )
                }}
              />
              <div className="flex">
                <Link
                  to={"/a/settings/role"}
                  className="mt-7 hover:text-blue-600 hover:underline"
                >
                  Role management
                </Link>
              </div>
            </div>
            <InputField
              label={t("edit-user-modal-email", "Email")}
              disabled
              value={user.email}
            />
          </Modal.Content>
          <Modal.Footer>
            <div className="flex w-full justify-end">
              <Button
                variant="ghost"
                size="small"
                onClick={handleClose}
                className="mr-2"
              >
                {t("edit-user-modal-cancel", "Cancel")}
              </Button>
              <Button
                loading={isLoading}
                disabled={isLoading}
                variant="primary"
                size="small"
              >
                {t("edit-user-modal-save", "Save")}
              </Button>
            </div>
          </Modal.Footer>
        </Modal.Body>
      </form>
    </Modal>
  )
}

export default EditUserModal
