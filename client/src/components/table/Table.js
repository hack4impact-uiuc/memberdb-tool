import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { AgGridReact } from 'ag-grid-react';

import '../../css/Table.css';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

const Table = ({ data, columns, onRowClick }) => {
  const [entries, setEntries] = useState([]);
  useEffect(() => {
    setEntries(data);
  }, [data]);

  return (
    <div className="ag-theme-alpine table-wrapper">
      <AgGridReact
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
};

export default Table;
