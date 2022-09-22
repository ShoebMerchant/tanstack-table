import React from "react";
import mockData from "./MOCK_DATA.json";
import startcase from "lodash.startcase";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Table from "./components/Tanstack-table/Table";
import { createColumnHelper } from "@tanstack/react-table";
const columnHelper = createColumnHelper();

function App() {
  /**
   * It's important that we're using React.useMemo here
   * to ensure that our data isn't recreated on every render.
   * If we didn't use React.useMemo, the table would think it was receiving new data on every render
   * and attempt to recalculate a lot of logic every single time. Not cool!
   */
  const data = React.useMemo(() => mockData, []);

  /**
   * Again, we're using React.useMemo so React Table doesn't recalculate
   * the universe on every single render.
   * Only when the memoized value actually changes!
   */
  const columns = React.useMemo(
    () =>
      Object.keys(mockData[0]).map((key) =>
        columnHelper.accessor(key, {
          cell: (info) => info.getValue(),
          header: startcase(key),
          id: key,
        })
      ),
    []
  );

  return (
    <div className="">
      <Table data={data} columns={columns} />
    </div>
  );
}

export default App;
