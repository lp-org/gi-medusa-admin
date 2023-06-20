import { useMutation, useQueries, useQuery } from "@tanstack/react-query"
import React, { useEffect, useMemo } from "react"
import { Controller, useFieldArray, useForm } from "react-hook-form"
import useNotification from "../../../hooks/use-notification"
import { getErrorMessage } from "../../../utils/error-messages"
import Button from "../../fundamentals/button"

import Modal from "../../molecules/modal"
import api from "../../../services/api"
import Checkbox from "../../atoms/checkbox"

import { CollapsibleTree } from "../../molecules/collapsible-tree"
import queryClient from "../../../services/queryClient"
import { PermissionType } from "../../../types/shared"

function groupPermissions(permissions: PermissionType[]) {
  const groupedPermissions: Record<string, PermissionType[]> = {}
  if (!permissions) {
    return {}
  }
  for (const permission of permissions) {
    const nameParts = permission.name.split(".")
    const group = nameParts[0]

    if (!groupedPermissions[group]) {
      groupedPermissions[group] = []
    }

    groupedPermissions[group].push(permission)
  }

  return groupedPermissions
}
type ModalProps = {
  roleId: string
  handleClose: () => void
}

const PermissionModal: React.FC<ModalProps> = ({ roleId, handleClose }) => {
  const notification = useNotification()
  const { mutate, isLoading } = useMutation({
    mutationFn: api.permissions.setRolePermission,
    onSuccess: () => {
      notification("Success", `Permissison updated`, "success")
      queryClient.invalidateQueries(["role", roleId])
      queryClient.invalidateQueries(["roleList"])
      handleClose()
    },
    onError: (error) => {
      notification("Error", getErrorMessage(error), "error")
    },
  })

  const onSubmit = (data: { permission: PermissionType[] }) => {
    console.log(data)
    mutate({ roleId, data })
  }
  const { data } = useQuery({
    queryFn: () => api.permissions.list(),
    queryKey: ["permissionList"],
  })

  const { data: payload } = useQuery({
    queryFn: () => api.roles.get(roleId),
    queryKey: ["role", roleId],
  })
  const { control, handleSubmit, getValues, reset } = useForm<{
    permission: PermissionType[]
  }>({
    defaultValues: { permission: [] },
  })
  const { remove, append } = useFieldArray({
    name: "permission",
    control,
  })
  const permissions = useMemo(() => groupPermissions(data?.data), [data])
  useEffect(() => {
    if (payload?.data) {
      reset({ permission: payload.data.permissions })
    }
  }, [payload])
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
                {Object.entries(permissions).map(([key, value]) => (
                  <CollapsibleTree>
                    <CollapsibleTree.Parent>
                      <Checkbox
                        label={key}
                        checked={value.every(
                          (el) =>
                            getValues("permission").findIndex(
                              (perm) => perm.id === el.id
                            ) >= 0
                        )}
                        onChange={(e) => {
                          if (e.target.checked) {
                            value.forEach((el) => append(el))
                          } else {
                            value.forEach((el) =>
                              remove(
                                getValues("permission").findIndex(
                                  (perm) => perm.id === el.id
                                )
                              )
                            )
                          }
                        }}
                      />
                    </CollapsibleTree.Parent>
                    <CollapsibleTree.Content>
                      {value.map(({ id, name }) => (
                        <CollapsibleTree.Leaf>
                          <Controller
                            name={`permission`}
                            control={control}
                            render={({ field }) => (
                              <Checkbox
                                label={name}
                                checked={
                                  field.value.findIndex((el) => el.id === id) >=
                                  0
                                }
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    append({ id, name })
                                  } else {
                                    remove(
                                      getValues("permission").findIndex(
                                        (el) => el.id === id
                                      )
                                    )
                                  }
                                }}
                              />
                            )}
                          ></Controller>
                        </CollapsibleTree.Leaf>
                      ))}
                    </CollapsibleTree.Content>
                  </CollapsibleTree>
                ))}
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
