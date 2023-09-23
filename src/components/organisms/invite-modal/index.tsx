import { useAdminCreateInvite } from "medusa-react"
import React, { useMemo } from "react"
import { Controller, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import useNotification from "../../../hooks/use-notification"
import { Role } from "../../../types/shared"
import { getErrorMessage } from "../../../utils/error-messages"
import Button from "../../fundamentals/button"
import InputField from "../../molecules/input"
import Modal from "../../molecules/modal"
import Select from "../../molecules/select"
import { useMutation, useQuery } from "@tanstack/react-query"
import api from "../../../services/api"
import { NextSelect } from "../../molecules/select/next-select"

type InviteModalProps = {
  handleClose: () => void
}

type InviteModalFormData = {
  user: string
  role: Role
}

const InviteModal: React.FC<InviteModalProps> = ({ handleClose }) => {
  const notification = useNotification()
  const { t } = useTranslation()

  const { mutate, isLoading } = useMutation({ mutationFn: api.invites.create })

  const { control, register, handleSubmit } = useForm<InviteModalFormData>()

  const onSubmit = (data: InviteModalFormData) => {
    mutate(
      {
        user: data.user,
        role_id: data.role.value,
      },
      {
        onSuccess: () => {
          notification(
            t("invite-modal-success", "Success"),
            t(
              "invite-modal-invitation-sent-to",
              "Invitation sent to {{user}}",
              {
                user: data.user,
              }
            ),
            "success"
          )
          handleClose()
        },
        onError: (error) => {
          notification(
            t("invite-modal-error", "Error"),
            getErrorMessage(error),
            "error"
          )
        },
      }
    )
  }

  const { data } = useQuery({
    queryFn: () => api.roles.list(),
    queryKey: ["roleList"],
  })

  const roleOptions = useMemo(() => {
    const list = data?.data.data
    return list ? list.map((el) => ({ value: el.id, label: el.name })) : []
  }, [data])


  return (
    <Modal handleClose={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <Modal.Header handleClose={handleClose}>
            <span className="inter-xlarge-semibold">
              {t("invite-modal-invite-users", "Invite Users")}
            </span>
          </Modal.Header>
          <Modal.Content>
            <div className="flex flex-col gap-y-base">
              <InputField
                label={t("invite-modal-email", "Email")}
                placeholder="lebron@james.com"
                required
                {...register("user", { required: true })}
              />
              <Controller
                name="role"
                control={control}
                defaultValue={roleOptions[0]}
                render={({ field: { value, onChange, onBlur, ref } }) => {
                  return (
                    <NextSelect
                      label={t("invite-modal-role", "Role")}
                      placeholder={t("invite-modal-select-role", "Select role")}
                      onBlur={onBlur}
                      ref={ref}
                      onChange={onChange}
                      options={roleOptions}
                      value={value}
                    />
                  )
                }}
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
                {t("invite-modal-cancel", "Cancel")}
              </Button>
              <Button
                loading={isLoading}
                disabled={isLoading}
                size="large"
                className="w-32 justify-center text-small"
                variant="primary"
              >
                {t("invite-modal-invite", "Invite")}
              </Button>
            </div>
          </Modal.Footer>
        </Modal.Body>
      </form>
    </Modal>
  )
}

export default InviteModal
