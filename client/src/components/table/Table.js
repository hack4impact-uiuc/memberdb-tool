import React, { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';

import '../../css/Table.css';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

const Table = () => {
  // Sort Birth Dates in ascending order (earlier dates first)   
  const dateComparator = (value1, value2) => {
    const date1 = new Date(value1)
    const date2 = new Date(value2)
    return date1 - date2
  }

  // Sort Grad Year in ascending order (earlier grad years first)
  const semesterComparator = (value1, value2) => {
    const sem1 = value1.split(" ")[0]
    const year1 = value1.split(" ")[1]
    const sem2 = value2.split(" ")[0]
    const year2 = value2.split(" ")[1]
    if (year1 < year2) {
      return -1
    } else if (year1 > year2) {
      return 1
    } else {
      if (sem1 === "Fall" && sem2 === "Spring") {
        return 1
      } else if (sem1 === "Spring" && sem2 === "Fall") {
        return -1
      } else {
        return 0
      }
    }
  }

  const [columnDefs] = useState([
    { headerName: 'Name', field: 'name', width: 100, sortable: true },
    { headerName: 'Email', field: 'email', width: 180, sortable: true },
    { headerName: 'Phone #', field: 'phone', width: 160, sortable: true },
    { headerName: 'NetID', field: 'netid', width: 120, sortable: true },
    { headerName: 'UIN', field: 'uin', width: 120, sortable: true },
    {
      headerName: 'Major',
      field: 'major',
      width: 120,
      sortable: true,
      filter: true,
    },
    {
      headerName: 'Birth Date',
      field: 'birthdate',
      width: 120,
      sortable: true,
      comparator: dateComparator
    },
    { headerName: 'Github', field: 'github', width: 140, sortable: true },
    { headerName: 'Snapchat', field: 'snapchat', width: 140, sortable: true },
    { headerName: 'Instagram', field: 'instagram', width: 140, sortable: true },
    {
      headerName: 'Grad Sem/Yr',
      field: 'grad',
      width: 190,
      sortable: true,
      filter: true,
      comparator: semesterComparator
    },
    {
      headerName: 'Generation',
      field: 'generation',
      width: 120,
      sortable: true,
      filter: true,
      comparator: semesterComparator
    },
    {
      headerName: 'Location',
      field: 'location',
      width: 120,
      sortable: true,
      filter: true,
    },
    {
      headerName: 'Role',
      field: 'role',
      width: 160,
      sortable: true,
      filter: true,
    },
    {
      headerName: 'Level',
      field: 'level',
      width: 120,
      sortable: true,
      filter: true,
    },
    {
      headerName: 'Status',
      field: 'status',
      width: 120,
      sortable: true,
      filter: true,
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
    {
      name: 'Alice',
      email: 'alicesf2@illinois.edu',
      phone: '(123)-456-7891',
      netid: 'alicesf2',
      uin: 123456789,
      major: 'CS',
      birthdate: '01/02/3000',
      github: 'alicesf2',
      snapchat: 'alicesf2',
      instagram: 'alicesf2',
      grad: 'Fall 2020 (Alum)',
      generation: 'Fall 2018',
      location: 'On-campus',
      role: 'Tech Lead',
      level: 'Member',
      status: 'Active',
    },
    {
      name: 'Jefffrey',
      email: 'alicesf2@illinois.edu',
      phone: '(123)-456-7891',
      netid: 'alicesf2',
      uin: 123456789,
      major: 'CS',
      birthdate: '01/02/1999',
      github: 'alicesf2',
      snapchat: 'alicesf2',
      instagram: 'alicesf2',
      grad: 'Spring 2020',
      generation: 'Spring 2024',
      location: 'Remote',
      role: 'Tech Lead',
      level: 'Member',
      status: 'Hiatus',
    },
  ]);
  return (
    <div className="ag-theme-alpine table-wrapper">
      <AgGridReact columnDefs={columnDefs} rowData={rowData}></AgGridReact>
    </div>
  );
};

export default Table;
