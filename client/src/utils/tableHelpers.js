// Sort Birth Dates in ascending order (earlier dates first)
const dateComparator = (value1, value2) => {
  const date1 = new Date(value1);
  const date2 = new Date(value2);
  return date1 - date2;
};

// Sort Grad Year && Generation in ascending order (earlier cohorts first)
const semesterComparator = (value1, value2) => {
  const [sem1, year1] = value1.split(' ');
  const [sem2, year2] = value2.split(' ');
  if (year1 < year2) return -1;
  if (year1 > year2) return 1;
  if (sem1 === 'Fall' && sem2 === 'Spring') return 1;
  if (sem1 === 'Spring' && sem2 === 'Fall') return -1;
  return 0;
};

export const columnDefs = [
  {
    headerName: 'Name',
    field: 'name',
    checkboxSelection: true,
  },
  {
    headerName: 'Email',
    field: 'email',
  },
  {
    headerName: 'Phone #',
    field: 'phone',
  },
  {
    headerName: 'NetID',
    field: 'netid',
  },
  {
    headerName: 'UIN',
    field: 'uin',
  },
  {
    headerName: 'Major',
    field: 'major',
  },
  {
    headerName: 'Birth Date',
    field: 'birthdate',
    comparator: dateComparator,
  },
  {
    headerName: 'Github',
    field: 'github',
  },
  {
    headerName: 'Snapchat',
    field: 'snapchat',
  },
  {
    headerName: 'Instagram',
    field: 'instagram',
  },
  {
    headerName: 'Grad Sem/Yr',
    field: 'grad',
    comparator: semesterComparator,
  },
  {
    headerName: 'Generation',
    field: 'generation',
    comparator: semesterComparator,
  },
  {
    headerName: 'Location',
    field: 'location',
  },
  {
    headerName: 'Role',
    field: 'role',
  },
  {
    headerName: 'Level',
    field: 'level',
  },
  {
    headerName: 'Status',
    field: 'status',
  },
];
