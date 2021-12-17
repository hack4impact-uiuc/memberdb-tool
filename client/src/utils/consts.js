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
    key: 'UPENN',
    value: 'UPENN',
    text: 'University of Pennsylvania',
  },
  {
    key: 'UIUC',
    value: 'UIUC',
    text: 'University of Illinois at Urbana-Champaign',
  },
  {
    key: 'GEORGIA_TECH',
    value: 'GEORGIA_TECH',
    text: 'Bits of Good - Georgia Tech',
  },
  {
    key: 'CORNELL_UNIVERSITY',
    value: 'CORNELL_UNIVERSITY',
    text: 'Cornell University',
  },
  {
    key: 'BOSTON_UNIVERSITY',
    value: 'BOSTON_UNIVERSITY',
    text: 'Boston University',
  },
  {
    key: 'CALIFORNIA_POLYTECHNIC_STATE_UNIVERSITY',
    value: 'CALIFORNIA_POLYTECHNIC_STATE_UNIVERSITY',
    text: 'California Polytechnic State University',
  },
  {
    key: 'MCGILL_UNIVERSITY',
    value: 'MCGILL_UNIVERSITY',
    text: 'McGill University',
  },
  {
    key: 'UNIVERSITY_OF_MARYLAND_COLLEGE_PARK',
    value: 'UNIVERSITY_OF_MARYLAND_COLLEGE_PARK',
    text: 'University of Maryland, College Park',
  },
  {
    key: 'UNIVERSITY_OF_TENNESSEE_KNOXVILLE',
    value: 'UNIVERSITY_OF_TENNESSEE_KNOXVILLE',
    text: 'University of Tennessee, Knoxville',
  },
  {
    key: 'UNIVERSITY_OF_MICHIGAN',
    value: 'UNIVERSITY_OF_MICHIGAN',
    text: 'University of Michigan',
  },
  {
    key: 'CARLETON_COLLEGE',
    value: 'CARLETON_COLLEGE',
    text: 'Carleton College',
  },
  {
    key: 'NEW_YORK_UNIVERSITY',
    value: 'NEW_YORK_UNIVERSITY',
    text: 'New York University',
  },
];

export const possibleStatuses = [
  {
    key: 'PRODUCT_RESEARCH',
    value: 'PRODUCT_RESEARCH',
    text: 'Product Research',
  },
  {
    key: 'UNDER_DEVELOPMENT',
    value: 'UNDER_DEVELOPMENT',
    text: 'Under Development',
  },
  {
    key: 'ON_HOLD',
    value: 'ON_HOLD',
    text: 'On Hold',
  },
  {
    key: 'COMPLETED',
    value: 'COMPLETED',
    text: 'Completed',
  },
  {
    key: 'ABANDONED',
    value: 'ABANDONED',
    text: 'Abandoned',
  },
];

export default { levelEnum, requiredFields, chapterOptions, possibleStatuses };
