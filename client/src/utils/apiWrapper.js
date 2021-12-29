import axios from 'axios';

import { BACKEND_BASE_URL } from './apiUrls';

// Axios Configuration
axios.defaults.withCredentials = true;

// retrieves the session status of the current user
export const getUserAuth = () => {
  const requestString = `${BACKEND_BASE_URL}/members/current`;
  return axios
    .get(requestString, {
      headers: {
        'Content-Type': 'application/JSON',
      },
    })
    .catch((error) => ({
      type: 'GET_AUTH_FAIL',
      error,
    }));
};

// logs a user out
export const endUserSession = () => {
  const requestString = `${BACKEND_BASE_URL}/auth/logout`;
  return axios
    .post(requestString, {
      headers: {
        'Content-Type': 'application/JSON',
      },
    })
    .catch((error) => ({
      type: 'GET_SESSION_END_FAIL',
      error,
    }));
};

// Retrieves a member from their mongo ID
export const getMemberByID = (mongoID) => {
  const requestString = `${BACKEND_BASE_URL}/members/${mongoID}`;
  return axios
    .get(requestString, {
      headers: {
        'Content-Type': 'application/JSON',
      },
    })
    .catch((error) => ({
      type: 'GET_MEMBER_BY_ID_FAIL',
      error,
    }));
};

// Retrieves a member's permissions from their mongo ID
export const getMemberPermissionsByID = (mongoID) => {
  const requestString = `${BACKEND_BASE_URL}/members/${mongoID}/permissions`;
  return axios
    .get(requestString, {
      headers: {
        'Content-Type': 'application/JSON',
      },
    })
    .catch((error) => ({
      type: 'GET_MEMBER_PERMISSIONS_BY_ID_FAIL',
      error,
    }));
};

// Retrieves a member's permissions from their mongo ID
export const getMemberEnumOptions = () => {
  const requestString = `${BACKEND_BASE_URL}/members/options`;
  return axios
    .get(requestString, {
      headers: {
        'Content-Type': 'application/JSON',
      },
    })
    .catch((error) => ({
      type: 'GET_MEMBER_ENUM_OPTIONS_FAIL',
      error,
    }));
};

// Retrieves a member's permissions from their mongo ID
export const getMemberSchemaTypes = () => {
  const requestString = `${BACKEND_BASE_URL}/members/schema`;
  return axios
    .get(requestString, {
      headers: {
        'Content-Type': 'application/JSON',
      },
    })
    .catch((error) => ({
      type: 'GET_MEMBER_SCHEMA_TYPES_FAIL',
      error,
    }));
};

// Retrieves all members
export const getMembers = () => {
  const requestString = `${BACKEND_BASE_URL}/members`;
  return axios
    .get(requestString, {
      headers: {
        'Content-Type': 'application/JSON',
      },
    })
    .catch((error) => ({
      type: 'GET_MEMBERS_FAIL',
      error,
    }));
};

// Retrieves a member's permissions from their mongo ID
export const updateMember = (member, memberID) => {
  const requestString = `${BACKEND_BASE_URL}/members/${memberID}`;
  return axios
    .put(requestString, {
      ...member,
    })
    .catch((error) => ({
      type: 'UPDATE_MEMBER_FAIL',
      error,
    }));
};

// Retrieves a note by ID
export const getNote = (noteID) => {
  const requestString = `${BACKEND_BASE_URL}/notes/${noteID}`;
  return axios
    .get(requestString, {
      headers: {
        'Content-Type': 'application/JSON',
      },
    })
    .catch((error) => ({
      type: 'GET_NOTE_FAIL',
      error,
    }));
};

// Retrieves notes info
export const getNotes = () => {
  const requestString = `${BACKEND_BASE_URL}/notes`;
  return axios
    .get(requestString, {
      headers: {
        'Content-Type': 'application/JSON',
      },
    })
    .catch((error) => ({
      type: 'GET_NOTES_FAIL',
      error,
    }));
};

// Updates a note
export const updateNote = (note, noteID) => {
  const requestString = `${BACKEND_BASE_URL}/notes/${noteID}`;
  return axios
    .put(requestString, {
      ...note,
    })
    .catch((error) => ({
      type: 'UPDATE_NOTE_FAIL',
      error,
    }));
};

// Deletes a note
export const deleteNote = (noteID) => {
  const requestString = `${BACKEND_BASE_URL}/notes/${noteID}`;
  return axios.delete(requestString).catch((error) => ({
    type: 'UPDATE_NOTE_FAIL',
    error,
  }));
};

// Creates a new note
export const createNote = (note) => {
  const requestString = `${BACKEND_BASE_URL}/notes`;
  return axios
    .post(requestString, {
      ...note,
    })
    .catch((error) => ({
      type: 'CREATE_NOTE_FAIL',
      error,
    }));
};

// Retrieves all note labels
export const getNoteLabels = () => {
  const requestString = `${BACKEND_BASE_URL}/notes/labels`;
  return axios
    .get(requestString, {
      headers: {
        'Content-Type': 'application/JSON',
      },
    })
    .catch((error) => ({
      type: 'GET_NOTES_LABELS_FAIL',
      error,
    }));
};

// Creates a new member
export const createMember = (member) => {
  const requestString = `${BACKEND_BASE_URL}/members/`;
  return axios
    .post(requestString, {
      ...member,
    })
    .catch((error) => ({
      type: 'GET_MEMBER_SCHEMA_TYPES_FAIL',
      error,
    }));
};

// Retrieves all projects
export const getProjects = () => {
  const requestString = `${BACKEND_BASE_URL}/projects`;
  return axios
    .get(requestString, {
      headers: {
        'Content-Type': 'application/JSON',
      },
    })
    .catch((error) => ({
      type: 'GET_PROJECTS_FAIL',
      error,
    }));
};

// Updates a project
export const updateProject = (project, projectID) => {
  const requestString = `${BACKEND_BASE_URL}/projects/${projectID}`;
  return axios
    .put(requestString, {
      ...project,
    })
    .catch((error) => ({
      type: 'UPDATE_PROJECT_FAIL',
      error,
    }));
};
