import React from 'react'

export default function TableBottom({ resetOrder, resetFilters, table }) {
  return (
    <div className="d-flex" style={{ width: table.getCenterTotalSize() }}>
      <button onClick={() => resetOrder()} className="btn btn-primary">
        Reset Column Order
      </button>
      <button onClick={() => resetFilters()} className="btn btn-primary ms-1">
        Reset Filter
      </button>
      <div className="d-flex ms-auto justify-content-center">
        <button
          className="btn border tanstack-table-hook-pg-navigation-btn"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}>
          {"<<"}
        </button>
        <button
          className="btn border tanstack-table-hook-pg-navigation-btn"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}>
          {"<"}
        </button>
        <button
          className="btn border tanstack-table-hook-pg-navigation-btn"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}>
          {">"}
        </button>
        <button
          className="btn border tanstack-table-hook-pg-navigation-btn"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}>
          {">>"}
        </button>
        <span className="d-flex text-dark mx-2">
          <div>Page </div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </strong>
        </span>
        <span className="d-flex text-dark">
          <span style={{ whiteSpace: "nowrap" }} className="me-1">
            | Go to page:
          </span>
          <input
            style={{ fontSize: "inherit" }}
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            className="form-control border ps-2 me-1"
          />
        </span>
        <select
          className="border"
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}>
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
