import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';

import columnDefs from '../../utils/tableHelpers';
import { getMembers } from '../../utils/apiWrapper';
import '../../css/Table.css';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

const Table = () => {
  const [members, setMembers] = useState([]);
  useEffect(() => {
    const getAllMembers = async () => {
      const allMembers = await getMembers();
      if (allMembers.data) {
        setMembers(allMembers.data.result);
      }
    };
    getAllMembers();
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
