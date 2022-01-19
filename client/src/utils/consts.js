// Useful for waterfall permissions where directors have all permissions
// Except for Admin permissions
export const levelEnum = {
  ADMIN: 4,
  DIRECTOR: 3,
  LEAD: 2,
  MEMBER: 1,
  TBD: 0,
};

export const requiredFields = [
  'email',
  'firstName',
  'lastName',
  'gradYear',
  'generationYear',
  'phone',
];

export const chapterOptions = [
  {
    key: 'University of Pennsylvania',
    value: 'University of Pennsylvania',
    text: 'University of Pennsylvania',
  },
  {
    key: 'University of Illinois at Urbana-Champaign',
    value: 'University of Illinois at Urbana-Champaign',
    text: 'University of Illinois at Urbana-Champaign',
  },
  {
    key: 'Bits of Good - Georgia Tech',
    value: 'Bits of Good - Georgia Tech',
    text: 'Bits of Good - Georgia Tech',
  },
  {
    key: 'Cornell University',
    value: 'Cornell University',
    text: 'Cornell University',
  },
  {
    key: 'Boston University',
    value: 'Boston University',
    text: 'Boston University',
  },
  {
    key: 'California Polytechnic State University',
    value: 'California Polytechnic State University',
    text: 'California Polytechnic State University',
  },
  {
    key: 'McGill University',
    value: 'McGill University',
    text: 'McGill University',
  },
  {
    key: 'University of Maryland, College Park',
    value: 'University of Maryland, College Park',
    text: 'University of Maryland, College Park',
  },
  {
    key: 'University of Tennessee, Knoxville',
    value: 'University of Tennessee, Knoxville',
    text: 'University of Tennessee, Knoxville',
  },
  {
    key: 'University of Michigan',
    value: 'University of Michigan',
    text: 'University of Michigan',
  },
  {
    key: 'Carleton College',
    value: 'Carleton College',
    text: 'Carleton College',
  },
  {
    key: 'New York University',
    value: 'New York University',
    text: 'New York University',
  },
];

export const possibleStatuses = [
  {
    key: 'Product Research',
    value: 'Product Research',
    text: 'Product Research',
  },
  {
    key: 'Under Development',
    value: 'Under Development',
    text: 'Under Development',
  },
  {
    key: 'On Hold',
    value: 'On Hold',
    text: 'On Hold',
  },
  {
    key: 'Completed',
    value: 'Completed',
    text: 'Completed',
  },
  {
    key: 'Abandoned',
    value: 'Abandoned',
    text: 'Abandoned',
  },
];

export default { levelEnum, requiredFields, chapterOptions, possibleStatuses };
