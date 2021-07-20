import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { AgGridReact } from 'ag-grid-react';

import '../../css/Table.css';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { Button } from "semantic-ui-react";

const Table = ({ data, columns, onRowClick, sizeToFit }) => {
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

Table.propTypes = {
  data: PropTypes.array,
  columns: PropTypes.array,
  onRowClick: PropTypes.func,
  sizeToFit: PropTypes.bool,
};

export default Table;
