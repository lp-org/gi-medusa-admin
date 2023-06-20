import React, { useEffect, useState } from "react"
import Breadcrumb from "../../../components/molecules/breadcrumb"
import invites from "@medusajs/medusa/dist/api/routes/admin/invites"
import actionables from "../../../components/molecules/actionables"
import BodyCard from "../../../components/organisms/body-card"
import UserTable from "../../../components/templates/user-table"
import users from "../users"
import PlusIcon from "../../../components/fundamentals/icons/plus-icon"

import RoleTable from "../../../components/templates/role-table"
import AddRoleModal from "../../../components/organisms/role-modal/add"
import queryClient from "../../../services/queryClient"
const Roles = () => {
  const actionables = [
    {
      label: "Add new role",
      onClick: () => setModalOpen(true),

      icon: (
        <span className="text-grey-90">
          <PlusIcon size={20} />
        </span>
      ),
    },
  ]

  const [modalOpen, setModalOpen] = useState(false)
  return (
    <div>
      <Breadcrumb
        previousRoute="/a/settings"
        previousBreadcrumb="Settings"
        currentPage="Roles"
      />
      <BodyCard title="Roles" subtitle="Manage roles" actionables={actionables}>
        <div className="flex grow  flex-col pt-2">
          <RoleTable />
        </div>
      </BodyCard>

      {modalOpen && (
        <AddRoleModal
          handleClose={() => {
            setModalOpen(false)
          }}
        />
      )}
    </div>
  )
}

export default Roles
