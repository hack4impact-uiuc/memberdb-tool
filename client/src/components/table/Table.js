import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';

import columnDefs from '../../utils/tableHelpers';
import mockMemberData from '../../utils/mockMemberData';
import '../../css/Table.css';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

const Table = () => {
  const [members] = useState(mockMemberData);
  const getMembers = async () => {
    // TODO: replace with getMembers() api call
  };

  useEffect(() => {
    getMembers();
  }, []);

  return (
    <div className="ag-theme-alpine table-wrapper">
      <AgGridReact
        rowData={members}
        defaultColDef={{
          filter: true,
          sortable: true,
          wrapText: true,
          autoHeight: true,
          enableCellTextSelection: true,
          ensureDomOrder: true,
        }}
        columnDefs={columnDefs}
        floatingFilter
        enableCellTextSelection
        rowSelection="multiple"
        rowMultiSelectWithClick
      />
    </div>
  );
};

export default Table;
