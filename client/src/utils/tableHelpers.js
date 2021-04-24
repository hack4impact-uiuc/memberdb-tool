import moment from 'moment';

const BirthDateFormat = 'MM/DD/YYYY';

const FieldVals = Object.freeze({
  fall: 'FALL',
  spring: 'SPRING',
  tbd: 'TBD',
});

// Sort Birth Dates in ascending order (earlier dates first)
const dateComparator = (value1, value2) => {
  const date1 = moment(value1, BirthDateFormat);
  const date2 = moment(value2, BirthDateFormat);
  return date1.diff(date2);
};

// Sort Grad Year && Generation in ascending order (earlier cohorts first)
const semesterComparator = (value1, value2) => {
  // parseInt uses base 10 when changing to an integer
  const [sem1, year1] = value1
    .split(' ')
    .map((val) => (parseInt(val, 10) ? Number(val) : val));
  const [sem2, year2] = value2
    .split(' ')
    .map((val) => (parseInt(val, 10) ? Number(val) : val));
  if (year1 < year2) return -1;
  if (year1 > year2) return 1;
  if (sem1 === FieldVals.fall && sem2 === FieldVals.spring) return 1;
  if (sem1 === FieldVals.spring && sem2 === FieldVals.fall) return -1;
  return 0;
};

// Combine both Semester and Year into a single column
const graduationGetter = ({ data }) => {
  if (data.gradSemester === FieldVals.tbd) return data.gradSemester;
  return `${data.gradSemester} ${data.gradYear}`;
};

const generationGetter = ({ data }) => {
  if (data.generationSemester === FieldVals.tbd) return data.generationSemester;
  return `${data.generationSemester} ${data.generationYear}`;
};

const nameGetter = ({ data }) =>
  `${data.firstName ?? ''} ${data.lastName ?? ''}`;

const birthDateGetter = ({ data }) => {
  if (!data.birthdate) return 'Not Given';
  const date = moment(data.birthdate).format(BirthDateFormat);
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
    headerName: 'Class Standing',
    field: 'classStanding',
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
    field: 'netID',
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
