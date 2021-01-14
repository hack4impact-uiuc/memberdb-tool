import React, { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';

import '../../css/Table.css';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

const Table = () => {
  const [columnDefs] = useState([
    {
      headerName: 'Name',
      field: 'name',
      width: 100,
      sortable: true,
    },
    {
      headerName: 'Email',
      field: 'email',
      width: 180,
      sortable: true,
    },
    {
      headerName: 'Phone #',
      field: 'phone',
      width: 160,
      sortable: true,
    },
    {
      headerName: 'NetID',
      field: 'netid',
      width: 120,
      sortable: true,
    },
    {
      headerName: 'UIN',
      field: 'uin',
      width: 120,
      sortable: true,
    },
    {
      headerName: 'Major',
      field: 'major',
      width: 120,
      sortable: true,
    },
    {
      headerName: 'Birth Date',
      field: 'birthdate',
      width: 120,
      sortable: true,
    },
    {
      headerName: 'Github',
      field: 'github',
      width: 140,
      sortable: true,
    },
    {
      headerName: 'Snapchat',
      field: 'snapchat',
      width: 140,
      sortable: true,
    },
    {
      headerName: 'Instagram',
      field: 'instagram',
      width: 140,
      sortable: true,
    },
    {
      headerName: 'Grad Sem/Yr',
      field: 'grad',
      width: 190,
      sortable: true,
    },
    {
      headerName: 'Generation',
      field: 'generation',
      width: 120,
      sortable: true,
    },
    {
      headerName: 'Location',
      field: 'location',
      width: 120,
      sortable: true,
    },
    {
      headerName: 'Role',
      field: 'role',
      width: 160,
      sortable: true,
    },
    {
      headerName: 'Level',
      field: 'level',
      width: 120,
      sortable: true,
    },
    {
      headerName: 'Status',
      field: 'status',
      width: 120,
      sortable: true,
    },
  ]);
  const [rowData] = useState([
    {
      name: 'Amit',
      email: 'sawhney4@illinois.edu',
      phone: '(309) 838-5466',
      netid: 'sawhney4',
      uin: 659426199,
      major: 'CS + Math',
      birthdate: '02/14/2002',
      github: 'amit-sawhney',
      snapchat: 'amit_sawhney02',
      instagram: 'amit__02',
      grad: 'Spring 2024 (Freshman)',
      generation: 'Fall 2020',
      location: 'On-campus',
      role: 'Software Developer',
      level: 'Member',
      status: 'Active',
    },
  ]);
  return (
    <div className="ag-theme-alpine table-wrapper">
      <AgGridReact columnDefs={columnDefs} rowData={rowData} />
    </div>
  );
};

export default Table;
