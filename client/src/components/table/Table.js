import React from 'react';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';

import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

// basic ag-grid table to ensure functionality
const Table = () => {
  const [gridApi, setGridApi] = React.useState(null);
  const [gridColumnApi, setGridColumnApi] = React.useState(null);

  const [rowData, setRowData] = React.useState([
    { make: 'Toyota', model: 'Celica', price: 35000 },
    { make: 'Ford', model: 'Mondeo', price: 32000 },
    { make: 'Porsche', model: 'Boxter', price: 72000 },
  ]);

  function onGridReady(params) {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  }

  return (
    <div
      className="ag-theme-alpine"
      style={{ height: 400, width: '80%', margin: 'auto' }}
    >
      <AgGridReact onGridReady={onGridReady} rowData={rowData}>
        <AgGridColumn field="make"></AgGridColumn>
        <AgGridColumn field="model"></AgGridColumn>
        <AgGridColumn field="price"></AgGridColumn>
      </AgGridReact>
    </div>
  );
};

export default Table;
