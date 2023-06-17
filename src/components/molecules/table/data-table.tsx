import React, {
  Fragment,
  HTMLProps,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react"
import {
  CellContext,
  Column,
  ColumnDef,
  ColumnDefTemplate,
  OnChangeFn,
  PaginationState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"

import Button from "../../fundamentals/button"
import ArrowLeftIcon from "../../fundamentals/icons/arrow-left-icon"
import ArrowRightIcon from "../../fundamentals/icons/arrow-right-icon"
import ChevronUpIcon from "../../fundamentals/icons/chevron-up"
import ChevronDownIcon from "../../fundamentals/icons/chevron-down"
import Table from "."
export function hasClass(className?: string, targetClass?: string) {
  if (!className || !targetClass) {
    return false // Return false if either className or targetClass is missing
  }
  const classes = className.split(" ") // Split className into an array of individual classes
  return classes.includes(targetClass) // Check if targetClass exists in the classes array
}
export type TableColumnProps<TData> = {
  header: string
  accessorKey?: string
  sort?: boolean
  cell?: ColumnDefTemplate<CellContext<TData, unknown>>
}

type TableProps<TData> = {
  data?: Array<TData>
  columns: ColumnDef<TData>[]
  selection?: boolean
  pagination?: PaginationState
  setPagination?: OnChangeFn<PaginationState>
  sorting?: SortingState
  setSorting?: OnChangeFn<SortingState>
  total?: number
}

const DataTable = <TData,>({
  data,
  columns,
  pagination,
  setPagination,
  sorting,
  setSorting,
  selection = true,
}: TableProps<TData>) => {
  const rerender = useReducer(() => ({}), {})[1]

  const [rowSelection, setRowSelection] = useState({})
  //   const [globalFilter, setGlobalFilter] = useState('')

  const localColumns = useMemo<ColumnDef<TData>[]>(() => {
    const tempCol: ColumnDef<TData, unknown>[] = []

    if (selection) {
      tempCol.push({
        id: "select",
        header: ({ table }) => (
          <IndeterminateCheckbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
            }}
          />
        ),
        cell: ({ row }) => (
          <IndeterminateCheckbox
            {...{
              checked: row.getIsSelected(),
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler(),
            }}
          />
        ),
      })
    }

    const result = tempCol.concat(columns)

    return result
  }, [columns, selection])

  const table = useReactTable({
    data: data?.data ?? [],
    columns: localColumns,
    pageCount: data && Math.ceil(data?.count / pagination?.pageSize),
    state: {
      sorting,
      rowSelection,
      pagination,
    },
    manualPagination: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    debugTable: true,
    enableColumnFilters: false,
  })

  return (
    <Fragment>
      {/* <div>
        <input
          value={globalFilter ?? ''}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="font-lg border-block border p-2 shadow"
          placeholder="Search all columns..."
        />
      </div> */}
      <div className="relative overflow-x-auto ">
        <Table>
          <Table.Head>
            {table.getHeaderGroups().map((headerGroup) => (
              <Table.Row key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <Table.HeadCell
                      key={header.id}
                      className={` ${
                        header.id === "select"
                          ? "w-10"
                          : header.column.columnDef.meta
                      }`}
                      colSpan={header.colSpan}
                      style={{
                        width: header.id === "select" ? "" : header.getSize(),
                      }}
                    >
                      {header.isPlaceholder ? null : (
                        <>
                          {header.column.getCanFilter() ? (
                            <div>
                              <Filter column={header.column} table={table} />
                            </div>
                          ) : null}

                          <div
                            {...{
                              className: header.column.getCanSort()
                                ? `cursor-pointer select-none flex items-center ${
                                    hasClass(
                                      header.column.columnDef.meta,
                                      "text-right"
                                    ) && "justify-end"
                                  }`
                                : "",
                              onClick: header.column.getToggleSortingHandler(),
                            }}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {{
                              asc: <ChevronUpIcon className="ml-2 w-4" />,
                              desc: <ChevronDownIcon className="ml-2 w-4" />,
                            }[header.column.getIsSorted() as string] ?? null}
                          </div>
                        </>
                      )}
                    </Table.HeadCell>
                  )
                })}
              </Table.Row>
            ))}
          </Table.Head>

          {/* <Reorder.Group axis="y" as="tbody" onReorder={setRecords} values={records} className="divide-y divide-gray-200">
          {records.map((row) => (
            <Reorder.Item key={row.id} as="tr" key={row.id} value={row}>
              <td className="py-4 px-6">sadasdasd</td>
              <td className="py-4 px-6">asdasdas</td>
              <td className="py-4 px-6">asdasdas</td>
            </Reorder.Item>
          ))}
        </Reorder.Group> */}
          {
            <>
              {table.getRowModel().rows.length === 0 ? (
                <tbody>
                  <tr className="relative">
                    <td
                      className="m-4 p-4 text-center"
                      colSpan={localColumns.length}
                    >
                      No data{" "}
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody className="divide-y divide-gray-200">
                  {table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          className={`overflow-hidden truncate py-2 pl-2 pr-4 ${cell.column.columnDef?.meta} text-gray-900 dark:text-white`}
                          key={cell.id}
                          style={{
                            width: cell.column.getSize(),
                          }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              )}
            </>
          }

          {/* <tfoot>
          <tr>
            <td className="w-4 p-4">
              <IndeterminateCheckbox
                {...{
                  checked: table.getIsAllPageRowsSelected(),
                  indeterminate: table.getIsSomePageRowsSelected(),
                  onChange: table.getToggleAllPageRowsSelectedHandler(),
                }}
              />
            </td>
            <td colSpan={20}>Page Rows ({table.getRowModel().rows.length})</td>
          </tr>
        </tfoot> */}
          {/* <div>
            {Object.keys(rowSelection).length} of{" "}
            {table.getPreFilteredRowModel().rows.length} Total Rows Selected
          </div> */}
        </Table>
      </div>
      <div className="h-2" />
      {/* Pagination */}

      {pagination && (
        <div className="flex items-center gap-x-small">
          <p>{`${
            table.getState().pagination.pageIndex + 1
          } of ${table.getPageCount()}`}</p>
          <div className="flex items-center gap-x-2xsmall">
            <Button
              variant="ghost"
              size="small"
              className="h-xlarge w-xlarge disabled:text-grey-40"
              type="button"
              disabled={!table.getCanPreviousPage()}
              onClick={table.previousPage}
            >
              <ArrowLeftIcon size={16} />
            </Button>
            <Button
              variant="ghost"
              size="small"
              className="h-xlarge w-xlarge disabled:text-grey-40"
              type="button"
              disabled={!table.getCanNextPage()}
              onClick={table.nextPage}
            >
              <ArrowRightIcon size={16} />
            </Button>
          </div>
        </div>
      )}
      <br />

      <hr />
      <br />
      <div>
        <button className="mb-2 rounded border p-2" onClick={() => rerender()}>
          Force Rerender
        </button>
      </div>
      <div>
        <button className="mb-2 rounded border p-2">Refresh Data</button>
      </div>
      <div>
        <button
          className="mb-2 rounded border p-2"
          onClick={() => console.info("rowSelection", rowSelection)}
        >
          Log `rowSelection` state
        </button>
      </div>
      <div>
        <button
          className="mb-2 rounded border p-2"
          onClick={() =>
            console.info(
              "table.getSelectedFlatRows()",
              table.getSelectedRowModel().flatRows
            )
          }
        >
          Log table.getSelectedFlatRows()
        </button>
      </div>
    </Fragment>
  )
}

// type DraggableRowProps<TData> = {
//   row: Row<TData>
//   onDragChange: (a: Row<TData>, b: Row<TData>) => void
//   setDraggingElement: (a: any) => void
// }

// const DraggableRow = <TData,>({ row, setDraggingElement }: DraggableRowProps<TData>) => {
//   const y = useMotionValue(0)
//   const boxShadow = useRaisedShadow(y)
//   const dragControls = useDragControls()

//   return (
//     <Reorder.Item
//       value={row.original}
//       as="tr"
//       style={{ boxShadow, y }}
//       dragListener={false}
//       dragControls={dragControls}
//       onDragEnd={(e) => {
//         setDraggingElement(row)
//       }}
//       className="bg-white text-gray-700  dark:bg-gray-900 dark:text-gray-400"
//     >
//       <td className="w-2 align-middle">
//         <button className="hover:cursor-grab ">
//           <MdOutlineDragIndicator size={20} onPointerDown={(event) => dragControls.start(event)} />
//         </button>
//       </td>

//       {row.getVisibleCells().map((cell) => (
//         <td key={cell.id} className="py-4 px-6">
//           {flexRender(cell.column.columnDef.cell, cell.getContext())}
//         </td>
//       ))}
//     </Reorder.Item>
//   )
// }

function Filter({
  column,
  table,
}: {
  column: Column<any, any>
  table: Table<any>
}) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id)

  return typeof firstValue === "number" ? (
    <div className="flex space-x-2">
      <input
        type="number"
        value={((column.getFilterValue() as any)?.[0] ?? "") as string}
        onChange={(e) =>
          column.setFilterValue((old: any) => [e.target.value, old?.[1]])
        }
        placeholder={`Min`}
        className="w-24 rounded border shadow"
      />
      <input
        type="number"
        value={((column.getFilterValue() as any)?.[1] ?? "") as string}
        onChange={(e) =>
          column.setFilterValue((old: any) => [old?.[0], e.target.value])
        }
        placeholder={`Max`}
        className="w-24 rounded border shadow"
      />
    </div>
  ) : (
    <input
      type="text"
      value={(column.getFilterValue() ?? "") as string}
      onChange={(e) => column.setFilterValue(e.target.value)}
      placeholder={`Search...`}
      className="w-36 rounded border shadow"
    />
  )
}

function IndeterminateCheckbox({
  indeterminate,
  className = "",
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  const ref = useRef<HTMLInputElement>(null!)

  useEffect(() => {
    if (typeof indeterminate === "boolean") {
      ref.current.indeterminate = !rest.checked && indeterminate
    }
  }, [ref, indeterminate, rest.checked])

  return (
    <input
      type="checkbox"
      ref={ref}
      className={
        className +
        " h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
      }
      {...rest}
    />
  )
}

export default DataTable
