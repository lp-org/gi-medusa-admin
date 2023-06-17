import React, { useState } from "react"

import { useQuery } from "@tanstack/react-query"
import Medusa from "../../../services/api"
import DataTable from "../../molecules/table/data-table"
import { ColumnDef } from "@tanstack/react-table"
import Button from "../../fundamentals/button"
import Actionables from "../../molecules/actionables"
import AddRoleModal from "../../organisms/role-modal/add"
import PermissionModal from "../../organisms/role-modal/permission-modal"
interface ColumnType {
  name: string
}
const RoleTable = () => {
  const columns: ColumnDef<ColumnType>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      id: "action",
      meta: "flex flex-row-reverse ml-auto",
      cell: ({ row }) => (
        <Actionables
          actions={[
            {
              label: "Edit",
              onClick: () => setModalOpen(true),
            },
            {
              label: "Set permission",
              onClick: () => setPermissionModalOpenOpen(true),
            },
          ]}
        />
      ),
    },
  ]
  const { data } = useQuery({
    queryKey: ["roleList"],
    queryFn: Medusa.roles.list,
  })
  const [modalOpen, setModalOpen] = useState(false)
  const [permissionModalOpen, setPermissionModalOpenOpen] = useState(false)
  return (
    <div className="h-full w-full overflow-y-auto">
      <DataTable columns={columns} data={data?.data} selection={false} />
      {modalOpen && <AddRoleModal handleClose={() => setModalOpen(false)} />}
      {permissionModalOpen && (
        <PermissionModal
          handleClose={() => setPermissionModalOpenOpen(false)}
        />
      )}
    </div>
  )
}

export default RoleTable
