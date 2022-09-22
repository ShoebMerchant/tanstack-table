import { flexRender } from "@tanstack/react-table";
import { columnResizeMode } from "../Table";
import { reorderColumn } from "../utils";
import Filter from "./Filter";

const ColumnHeader = ({ header, table, dontShowFilters }) => {
  const { getState, setColumnOrder } = table;
  const { columnOrder } = getState();
  const { column } = header;

  const onDrop = (event) => {
    const draggedColumn = JSON.parse(event.dataTransfer.getData("column"));
    if (column.id === "select") return;
    const newColumnOrder = reorderColumn(
      draggedColumn.id,
      column.id,
      columnOrder
    );
    setColumnOrder(newColumnOrder);
  };

  const dragStart = (event) => {
    event.dataTransfer.setData("column", JSON.stringify(column));
  };

  return (
    <th
      colSpan={header.colSpan}
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
      {...{
        key: header.id,
        style: {
          width: header.getSize(),
        },
      }}>
      <div>
        {header.isPlaceholder ? null : (
          <>
            <div
              {...{
                className: header.column.getCanSort()
                  ? "cursor-pointer select-none"
                  : "",
                onClick:
                  header.column.columnDef.isSortAvailable &&
                  header.column.getToggleSortingHandler(),
              }}>
              <span
                className="m-2 cursor-grabbing"
                draggable={header.column.columnDef.id !== "select"}
                onDragStart={(event) => dragStart(event)}>
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
                {header.column.columnDef.id !== "select" && " 🤚"}
              </span>
              {header.column.columnDef.isSortAvailable &&
                ({
                  asc: " 🔼",
                  desc: " 🔽",
                }[header.column.getIsSorted()] ??
                  " Y")}
            </div>
            {header.column.getCanFilter() && !dontShowFilters ? (
              <div>
                <Filter column={header.column} table={table} />
              </div>
            ) : null}
          </>
        )}

        <div
          {...{
            onMouseDown: header.getResizeHandler(),
            onTouchStart: header.getResizeHandler(),
            className: `resizer ${
              header.column.getIsResizing() ? "isResizing" : ""
            }`,
            style: {
              transform:
                columnResizeMode === "onEnd" && header.column.getIsResizing()
                  ? `translateX(${
                      table.getState().columnSizingInfo.deltaOffset
                    }px)`
                  : "",
            },
          }}
        />
      </div>
    </th>
  );
};
export default ColumnHeader;
