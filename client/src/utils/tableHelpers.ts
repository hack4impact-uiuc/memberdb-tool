import moment from 'moment';

import LinkIcons, { Link } from '../components/table/LinkIcons';

import { titleCaseFormatter } from './formatters';

/**
 * @constant
 * @type {string}
 */
const BIRTH_DATE_FORMAT = 'MM/DD/YYYY';

/**
 * @constant
 * @type {Object}
 */
const FieldVals = Object.freeze({
  fall: 'FALL',
  spring: 'SPRING',
  tbd: 'TBD',
});

// Sort Birth Dates in ascending order (earlier dates first)
const dateComparator = (value1: any, value2: any) => {
  const date1 = moment(value1, BIRTH_DATE_FORMAT);
  const date2 = moment(value2, BIRTH_DATE_FORMAT);
  return date1.diff(date2);
};

// Sort Grad Year && Generation in ascending order (earlier cohorts first)
const semesterComparator = (value1: any, value2: any) => {
  // parseInt uses base 10 when changing to an integer
  const [sem1, year1] = value1
    .split(' ')
    .map((val: any) => (parseInt(val, 10) ? Number(val) : val));
  const [sem2, year2] = value2
    .split(' ')
    .map((val: any) => (parseInt(val, 10) ? Number(val) : val));
  if (year1 < year2) return -1;
  if (year1 > year2) return 1;
  if (sem1 === FieldVals.fall && sem2 === FieldVals.spring) return 1;
  if (sem1 === FieldVals.spring && sem2 === FieldVals.fall) return -1;
  return 0;
};

// Combine both Semester and Year into a single column
const graduationGetter = ({ data }: any) => {
  if (data.gradSemester === FieldVals.tbd) return data.gradSemester;
  return `${data.gradSemester} ${data.gradYear}`;
};

// Get generation label from member data
const generationGetter = ({ data }: any) => {
  if (data.generationSemester === FieldVals.tbd) return data.generationSemester;
  return `${data.generationSemester} ${data.generationYear}`;
};

// Gets full name from member data
const nameGetter = ({ data }: any) =>
  `${data.firstName ?? ''} ${data.lastName ?? ''}`;

// Gets birthday in format from member data
const birthDateGetter = ({ data }: any) => {
  if (!data.birthdate) return 'Not Given';
  const date = moment(data.birthdate).format(BIRTH_DATE_FORMAT);
  return date;
};

// Formats table for title case
const tableTitleCaseFormatter = ({ value }: any) => titleCaseFormatter(value);

/**
 * @constant
 * @type {Array<Object>}
 */
export const memberColumnDefs = [
  {
    headerName: 'Name',
    field: 'name',
    pinned: 'left',
    valueGetter: nameGetter,
  },
  {
    headerName: 'Class Standing',
    field: 'classStanding',
    valueFormatter: tableTitleCaseFormatter,
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
    headerName: 'Links',
    field: 'links',
    cellRendererFramework: LinkIcons,
    cellRendererParams: { linkTypes: [Link.GITHUB, Link.LINKEDIN, Link.OTHER] },
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
    valueFormatter: tableTitleCaseFormatter,
  },
  {
    headerName: 'Generation',
    valueGetter: generationGetter,
    comparator: semesterComparator,
    valueFormatter: tableTitleCaseFormatter,
  },
  {
    headerName: 'Location',
    field: 'location',
    valueFormatter: tableTitleCaseFormatter,
  },
  {
    headerName: 'Role',
    field: 'role',
    valueFormatter: tableTitleCaseFormatter,
  },
  {
    headerName: 'Level',
    field: 'level',
    valueFormatter: tableTitleCaseFormatter,
  },
  {
    headerName: 'Status',
    field: 'status',
    valueFormatter: tableTitleCaseFormatter,
  },
];

const membersFormatter = ({ value }: any) => value.map((m: any) => m.name).join(', ');

/**
 * @constant
 * @type {Array<Object>}
 */
export const notesColumnDefs = [
  {
    headerName: 'Title',
    field: 'metaData.title',
  },
  {
    headerName: 'Labels',
    field: 'metaData.labels',
  },
  {
    headerName: 'Referenced Members',
    field: 'metaData.referencedMembers',
    valueFormatter: membersFormatter,
  },
];

/**
 * @constant
 * @type {Array<Object>}
 */
export const projectColumnDefs = [
  {
    headerName: 'Project Name',
    field: 'projectName',
    pinned: 'left',
    valueGetter: nameGetter,
  },
  {
    headerName: 'Chapter',
    field: 'chapter',
    valueFormatter: tableTitleCaseFormatter,
  },
  {
    headerName: 'Description',
    field: 'description',
  },
  {
    headerName: 'Status',
    valueGetter: generationGetter,
    comparator: semesterComparator,
    valueFormatter: tableTitleCaseFormatter,
  },
  {
    headerName: 'Duration',
    field: 'duration',
  },
  {
    headerName: 'Team Email Contact',
    field: 'teamMembersEmail',
  },
  {
    headerName: 'Website URL',
    field: 'websiteUrl',
  },
  {
    headerName: 'Github URL',
    field: 'githubUrl',
  },
  {
    headerName: 'Figma URL',
    field: 'figmaUrl',
  },
  {
    headerName: 'Notes',
    field: 'notes',
  },
];
