import React, { useState } from "react"
import Spacer from "../../components/atoms/spacer"
import { Route, Routes, useNavigate } from "react-router-dom"

import BodyCard from "../../components/organisms/body-card"
import TableViewHeader from "../../components/organisms/custom-table-header"
import PlusIcon from "../../components/fundamentals/icons/plus-icon"
import New from "./new"
import DataTable from "../../components/molecules/table/data-table"
import { useQuery } from "@tanstack/react-query"
import api from "../../services/api"
import Actionables from "../../components/molecules/actionables"
import { ColumnDef, PaginationState } from "@tanstack/react-table"
import { PagesType } from "../../types/shared"
import Edit from "./edit"
import Badge from "../../components/fundamentals/badge"
import priceList from "@medusajs/medusa/dist/repositories/price-list"
import Fade from "../../components/atoms/fade-wrapper"

import { ViewType } from "../pricing/pricing-form/types"
import PageForm from "./pageForm"

const PagesIndex = () => {
  const navigate = useNavigate()
  const { data } = useQuery({
    queryFn: () => api.pages.list(),
    queryKey: ["pageList"],
  })

  const columns: ColumnDef<PagesType>[] = [
    {
      accessorKey: "title",
      header: "Title",
      size: 300,
    },
    {
      accessorKey: "handle",
      header: "Handle",
      size: 300,
    },
    {
      accessorKey: "publish",
      header: "Status",
      size: 300,
      cell: ({ row }) =>
        row.original.publish ? (
          <Badge variant="success"> Published</Badge>
        ) : (
          <Badge variant="warning"> Draft</Badge>
        ),
    },
    {
      accessorKey: "customize",
      header: "Customize",
      size: 200,
      cell: ({ row }) =>
        row.original.customize ? (
          <Badge variant="success"> YES</Badge>
        ) : (
          <Badge variant="warning"> NO</Badge>
        ),
    },
    {
      accessorKey: "rank",
      header: "Rank",
      size: 100,
    },
    {
      id: "action",
      meta: "flex flex-row-reverse ml-auto",
      cell: ({ row }) => (
        <Actionables
          actions={[
            {
              label: "Edit",
              onClick: () => navigate(`/a/pages/${row.original.id}`),
            },

            // {
            //   label: "Delete",
            //   onClick: () => setConfirmDelete(row.original.id),
            // },
          ]}
        />
      ),
    },
  ]
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const actionables = [
    {
      label: "Add page",
      onClick: () => navigate(`/a/pages/new`),
      icon: <PlusIcon size={20} />,
    },
  ]

  return (
    <div className="flex h-full flex-col">
      <div className="flex w-full grow flex-col">
        <BodyCard
          actionables={actionables}
          customHeader={<TableViewHeader views={["Page lists"]} />}
          className="h-fit"
        >
          <DataTable
            columns={columns}
            data={data?.data}
            selection={false}
            {...{ pagination, setPagination }}
          />
        </BodyCard>
        <Spacer />
      </div>
    </div>
  )
}

const Pages = () => {
  return (
    <Routes>
      <Route index element={<PagesIndex />} />
      <Route path="/new" element={<New />} />
      <Route path="/:id" element={<Edit />} />
    </Routes>
  )
}
export default Pages
