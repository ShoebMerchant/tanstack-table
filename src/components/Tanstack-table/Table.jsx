import React, { useMemo, Fragment, useState, useEffect } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getExpandedRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table";
import "./tanstack-table.css";
import { fuzzyFilter } from "./utils";
import ColumnHeader from "./components/ColumnHeader";
import TableBottom from "./components/TableBottom";
import DebouncedInput from "./components/DebouncedInput";
import isEmpty from "lodash.isEmpty";
import TableRow from "./components/TableRow";

export const columnResizeMode = "onChange"; // onEnd

/**
 * unique-column-ids
 * https://tanstack.com/table/v8/docs/guide/column-defs#unique-column-ids
 */

export default function Table({
  columns,
  data,
  renderSubComponent,
  getRowCanExpand = () => false,
  setSelectedRows,
  nestedTableDataId,
  draggable = false,
  onContextMenu,
  dontShowFilters = false,
  showGlobalSearch = true,
  showTableBottom = true,
  onDrop,
}) {
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState({});
  const [columnOrder, setColumnOrder] = useState(
    columns.map((column) => column.id) //must start out with populated columnOrder so we can splice
  );

  const getColumns = useMemo(() => {
    return columns;
  }, [columns]);

  const getData = useMemo(() => data, [data]);

  const resetOrder = () => setColumnOrder(columns.map((column) => column.id));
  const resetFilters = () => setColumnFilters([]);

  const table = useReactTable({
    data: getData,
    columns: getColumns,
    getRowCanExpand,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      columnOrder,
      columnFilters,
      globalFilter,
      rowSelection,
    },
    getExpandedRowModel: getExpandedRowModel(),
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    columnResizeMode,
    onColumnOrderChange: setColumnOrder,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    debugTable: true,
    // debugHeaders: true,
    // debugColumns: false,
  });

  useEffect(() => {
    if (setSelectedRows) {
      if (!isEmpty(rowSelection))
        setSelectedRows(
          table.getSelectedRowModel().flatRows.map((row) => row.original)
        );
      else setSelectedRows([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowSelection, setSelectedRows]);

  return (
    <div className="mb-3">
      {showGlobalSearch && (
        <DebouncedInput
          value={globalFilter ?? ""}
          onChange={(value) => setGlobalFilter(String(value))}
          className="form-control w-25 my-1 px-2"
          placeholder="Search all columns..."
        />
      )}
      <table
        {...{
          style: {
            width: table.getCenterTotalSize(),
          },
        }}
        className="table table-hover">
        {data && (
          <Fragment>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <ColumnHeader
                      key={header.id}
                      header={header}
                      table={table}
                      dontShowFilters={dontShowFilters}
                    />
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row, idx) => (
                <TableRow
                  table={table}
                  rowSelection={rowSelection}
                  key={idx}
                  row={row}
                  draggable={draggable}
                  flexRender={flexRender}
                  renderSubComponent={renderSubComponent}
                  nestedTableDataId={nestedTableDataId}
                  onContextMenu={onContextMenu}
                  onDrop={onDrop}
                />
              ))}
            </tbody>
            {/* <tfoot>
              {table.getFooterGroups().map((footerGroup) => (
                <tr key={footerGroup.id}>
                  {footerGroup.headers.map((header) => (
                    <th key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.footer,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </tfoot> */}
          </Fragment>
        )}
      </table>
      {data && showTableBottom && (
        <TableBottom
          resetOrder={resetOrder}
          resetFilters={resetFilters}
          table={table}
        />
      )}
    </div>
  );
}
