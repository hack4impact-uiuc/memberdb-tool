import moment from 'moment';

const birthDateFormat = 'MM/DD/YYYY';

const fieldVals = {
  fall: 'FALL',
  spring: 'SPRING',
  tbd: 'TBD',
};

// Sort Birth Dates in ascending order (earlier dates first)
const dateComparator = (value1, value2) => {
  const date1 = moment(value1, birthDateFormat);
  const date2 = moment(value2, birthDateFormat);
  return date1.diff(date2);
};

// Sort Grad Year && Generation in ascending order (earlier cohorts first)
const semesterComparator = (value1, value2) => {
  const [sem1, year1] = value1
    .split(' ')
    .map((val) => (parseInt(val, 10) ? Number(val) : val));
  const [sem2, year2] = value2
    .split(' ')
    .map((val) => (parseInt(val, 10) ? Number(val) : val));
  if (year1 < year2) return -1;
  if (year1 > year2) return 1;
  if (sem1 === fieldVals.fall && sem2 === fieldVals.spring) return 1;
  if (sem1 === fieldVals.spring && sem2 === fieldVals.fall) return -1;
  return 0;
};

// Combine both Semester and Year into a single column
const graduationGetter = ({ data }) => {
  if (data.gradSemester === fieldVals.tbd) return data.gradSemester;
  return `${data.gradSemester} ${data.gradYear}`;
};

const generationGetter = ({ data }) => {
  if (data.generationSemester === fieldVals.tbd) return data.generationSemester;
  return `${data.generationSemester} ${data.generationYear}`;
};

const nameGetter = ({ data }) =>
  `${data.firstName ?? ''} ${data.lastName ?? ''}`;

const birthDateGetter = ({ data }) => {
  if (!data.birthdate) return 'Not Given';
  const date = moment(data.birthdate).format(birthDateFormat);
  return date;
};

export default [
  {
    headerName: 'Name',
    field: 'name',
    valueGetter: nameGetter,
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
    field: 'UIN',
  },
  {
    headerName: 'Major',
    field: 'major',
  },
  {
    headerName: 'Birth Date',
    valueGetter: birthDateGetter,
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
    valueGetter: graduationGetter,
    comparator: semesterComparator,
  },
  {
    headerName: 'Generation',
    valueGetter: generationGetter,
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
