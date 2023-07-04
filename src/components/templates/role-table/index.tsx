import React, { useState } from "react"

import { useMutation, useQuery } from "@tanstack/react-query"
import Medusa from "../../../services/api"
import DataTable from "../../molecules/table/data-table"
import { ColumnDef, PaginationState } from "@tanstack/react-table"
import Button from "../../fundamentals/button"
import Actionables from "../../molecules/actionables"
import AddRoleModal from "../../organisms/role-modal/add"
import PermissionModal from "../../organisms/role-modal/permission-modal"
import ConfirmationPrompt from "../../organisms/confirmation-prompt"

import useNotification from "../../../hooks/use-notification"
import { getErrorMessage } from "../../../utils/error-messages"
import { queryClient } from "../../../constants/query-client"
interface ColumnType {
  id: string
  name: string
  permissionsCount: number
  userCount: number
  inviteCount: number
}
const RoleTable = () => {
  const notification = useNotification()
  const columns: ColumnDef<ColumnType>[] = [
    {
      accessorKey: "name",
      header: "Name",
      size: 300,
    },
    {
      accessorKey: "permissionsCount",
      header: "Permissions count",
      meta: "text-right",
      size: 300,
    },
    {
      accessorKey: "assignedCount",
      header: "Assigned count",
      size: 300,
      meta: "text-right",
      cell: ({ row }) => row.original.userCount + row.original.inviteCount,
    },
    {
      id: "action",
      meta: "flex flex-row-reverse ml-auto",
      cell: ({ row }) => (
        <Actionables
          actions={[
            {
              label: "Edit",
              onClick: () =>
                setEditModal({ id: row.original.id, name: row.original.name }),
            },
            {
              label: "Set permission",
              onClick: () => setPermissionRoleId(row.original.id),
            },
            {
              label: "Delete",
              onClick: () => setConfirmDelete(row.original.id),
            },
          ]}
        />
      ),
    },
  ]
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const { data } = useQuery({
    queryKey: ["roleList", pagination],
    queryFn: (e) => {
      console.log(e)
      return Medusa.roles.list({
        limit: 10,
        offset: pagination.pageIndex * 10,
      })
    },
  })

  const { mutate } = useMutation({
    mutationFn: Medusa.roles.delete,
    onSuccess: () => {
      notification("Success", `Role deleted`, "success")
      queryClient.invalidateQueries({ queryKey: ["roleList"] })
      setConfirmDelete(undefined)
    },
    onError: (error) => {
      notification("Error", getErrorMessage(error), "error")
    },
  })
  const [editModal, setEditModal] = useState<ColumnType | undefined>(undefined)
  const [permissionRoleId, setPermissionRoleId] = useState<string | undefined>()
  const [confirmDelete, setConfirmDelete] = useState<string | undefined>()
  return (
    <div className="h-full w-full overflow-y-auto">
      <DataTable
        columns={columns}
        data={data?.data}
        selection={false}
        {...{ pagination, setPagination }}
      />
      {editModal && (
        <AddRoleModal
          payloadData={editModal}
          handleClose={() => setEditModal(undefined)}
        />
      )}
      {permissionRoleId && (
        <PermissionModal
          roleId={permissionRoleId}
          handleClose={() => setPermissionRoleId(undefined)}
        />
      )}
      {confirmDelete && (
        <ConfirmationPrompt
          heading="Delete"
          text="Confirm delete role?"
          confirmText="Delete role"
          cancelText="Cancel"
          handleClose={() => setConfirmDelete(undefined)}
          onConfirm={async () => {
            mutate(confirmDelete)
          }}
        />
      )}
    </div>
  )
}

export default RoleTable
