// @flow
import React, { useState, useEffect } from 'react';
import type { Node } from 'react';
import { AgGridReact } from 'ag-grid-react';

import '../../css/Table.css';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { Button } from "semantic-ui-react";

type TableProp = {
  data: Array<Object>,
  columns: Array<Object>,
  onRowClick: Function,
  sizeToFit?: boolean,
};

const Table = ({ data, columns, onRowClick, sizeToFit }: TableProp): Node => {
  const [entries, setEntries] = useState([]);
  const [gridApi, setGridApi ] = useState(null);

  const onGridReady = (params) => {
    setGridApi(params.api);
    sizeToFit && params.api.sizeColumnsToFit();
  }

  useEffect(() => {
    setEntries(data);
  }, [data]);

  return (
    <div className="ag-theme-alpine table-wrapper">
      <div className="action-container">
        <Button size="medium" onClick={() => gridApi.exportDataAsCsv()}> Export as CSV</Button>
      </div>
      <AgGridReact
        onGridReady={onGridReady}
        rowData={entries}
        defaultColDef={{
          filter: true,
          sortable: true,
          wrapText: true,
          autoHeight: true,
          enableCellTextSelection: true,
          ensureDomOrder: true,
        }}
        onRowClicked={(e) => onRowClick?.(e)}
        columnDefs={columns}
        floatingFilter
        enableCellTextSelection
        rowSelection="multiple"
        rowMultiSelectWithClick
      />
    </div>
  );
};

export default Table;
