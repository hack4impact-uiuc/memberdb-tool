import axios from 'axios';

import { BACKEND_BASE_URL } from './apiUrls';

// Axios Configuration
axios.defaults.withCredentials = true;

type ApiResponse = {
  data?: any;

  // these are for errors
  error?: any;
  type?: string;
}
// retrieves the session status of the current user
export const getUserAuth = async (): Promise<ApiResponse> => {
  const requestString = `${BACKEND_BASE_URL}/members/current`;
  try {
    return await axios
      .get(requestString, {
        headers: {
          'Content-Type': 'application/JSON',
        },
      });
  } catch (error) {
    return Promise.reject({
      type: 'GET_AUTH_FAIL',
      error,
    });
  }
};

// logs a user out
export const endUserSession = async (): Promise<ApiResponse> => {
  const requestString = `${BACKEND_BASE_URL}/auth/logout`;
  try {
    return await axios
      .post(requestString, {
        headers: {
          'Content-Type': 'application/JSON',
        },
      });
  } catch (error) {
    return Promise.reject({
      type: 'GET_SESSION_END_FAIL',
      error,
    });
  }
};

// Retrieves a member from their mongo ID
export const getMemberByID = async (mongoID: string): Promise<ApiResponse> => {
  const requestString = `${BACKEND_BASE_URL}/members/${mongoID}`;
  try {
    return await axios
      .get(requestString, {
        headers: {
          'Content-Type': 'application/JSON',
        },
      });
  } catch (error) {
    return Promise.reject({
      type: 'GET_MEMBER_BY_ID_FAIL',
      error,
    });
  }
};

// Retrieves a member's permissions from their mongo ID
export const getMemberPermissionsByID = async (mongoID: string): Promise<ApiResponse> => {
  const requestString = `${BACKEND_BASE_URL}/members/${mongoID}/permissions`;
  try {
    return await axios
      .get(requestString, {
        headers: {
          'Content-Type': 'application/JSON',
        },
      });
  } catch (error) {
    return Promise.reject({
      type: 'GET_MEMBER_PERMISSIONS_BY_ID_FAIL',
      error,
    });
  }
};

// Retrieves a member's permissions from their mongo ID
export const getMemberEnumOptions = async (): Promise<ApiResponse> => {
  const requestString = `${BACKEND_BASE_URL}/members/options`;
  try {
    return await axios
      .get(requestString, {
        headers: {
          'Content-Type': 'application/JSON',
        },
      });
  } catch (error) {
    return Promise.reject({
      type: 'GET_MEMBER_ENUM_OPTIONS_FAIL',
      error,
    });
  }
};

// Retrieves a member's permissions from their mongo ID
export const getMemberSchemaTypes = async (): Promise<ApiResponse> => {
  const requestString = `${BACKEND_BASE_URL}/members/schema`;
  try {
    return await axios
      .get(requestString, {
        headers: {
          'Content-Type': 'application/JSON',
        },
      });
  } catch (error) {
    return Promise.reject({
      type: 'GET_MEMBER_SCHEMA_TYPES_FAIL',
      error,
    });
  }
};

// Retrieves all members
export const getMembers = (): Promise<ApiResponse> => {
  const requestString = `${BACKEND_BASE_URL}/members`;
  try {
    return axios
    .get(requestString, {
      headers: {
        'Content-Type': 'application/JSON',
      },
    })
  } catch (error) {
    return Promise.reject({
      type: 'GET_MEMBERS_FAIL',
      error,
    });
  }

};

// Retrieves a member's permissions from their mongo ID
export const updateMember = async (member: any, memberID: string): Promise<ApiResponse> => {
  const requestString = `${BACKEND_BASE_URL}/members/${memberID}`;
  try {
    return await axios
      .put(requestString, {
        ...member,
      });
  } catch (error) {
    return Promise.reject({
      type: 'UPDATE_MEMBER_FAIL',
      error,
    });
  }
};

// Retrieves a note by ID
export const getNote = async (noteID: string): Promise<ApiResponse> => {
  const requestString = `${BACKEND_BASE_URL}/notes/${noteID}`;
  try {
    return await axios
      .get(requestString, {
        headers: {
          'Content-Type': 'application/JSON',
        },
      });
  } catch (error) {
    return Promise.reject({
      type: 'GET_NOTE_FAIL',
      error,
    });
  }
};

// Retrieves notes info
export const getNotes = async (): Promise<ApiResponse> => {
  const requestString = `${BACKEND_BASE_URL}/notes`;
  try {
    return await axios
      .get(requestString, {
        headers: {
          'Content-Type': 'application/JSON',
        },
      });
  } catch (error) {
    return Promise.reject({
      type: 'GET_NOTES_FAIL',
      error,
    });
  }
};

// Updates a note
export const updateNote = async (note: any, noteID: string): Promise<ApiResponse> => {
  const requestString = `${BACKEND_BASE_URL}/notes/${noteID}`;
  try {
    return await axios
      .put(requestString, {
        ...note,
      });
  } catch (error) {
    return Promise.reject({
      type: 'UPDATE_NOTE_FAIL',
      error,
    });
  }
};

// Deletes a note
export const deleteNote = async (noteID: string): Promise<ApiResponse> => {
  const requestString = `${BACKEND_BASE_URL}/notes/${noteID}`;
  try {
    return await axios.delete(requestString);
  } catch (error) {
    return Promise.reject({
      type: 'UPDATE_NOTE_FAIL',
      error,
    });
  }
};

// Creates a new note
export const createNote = async (note: any): Promise<ApiResponse> => {
  const requestString = `${BACKEND_BASE_URL}/notes`;
  try {
    return await axios
      .post(requestString, {
        ...note,
      });
  } catch (error) {
    return Promise.reject({
      type: 'CREATE_NOTE_FAIL',
      error,
    });
  }
};

// Retrieves all note labels
export const getNoteLabels = async (): Promise<ApiResponse> => {
  const requestString = `${BACKEND_BASE_URL}/notes/labels`;
  try {
    return await axios
      .get(requestString, {
        headers: {
          'Content-Type': 'application/JSON',
        },
      });
  } catch (error) {
    return Promise.reject({
      type: 'GET_NOTES_LABELS_FAIL',
      error,
    });
  }
};

// Creates a new member
export const createMember = async (member: any): Promise<ApiResponse> => {
  const requestString = `${BACKEND_BASE_URL}/members/`;
  try {
    return await axios
      .post(requestString, {
        ...member,
      });
  } catch (error) {
    return Promise.reject({
      type: 'GET_MEMBER_SCHEMA_TYPES_FAIL',
      error,
    });
  }
};

// Retrieves all projects
export const getProjects = async (): Promise<ApiResponse> => {
  const requestString = `${BACKEND_BASE_URL}/projects`;
  try {
    return await axios
      .get(requestString, {
        headers: {
          'Content-Type': 'application/JSON',
        },
      });
  } catch (error) {
    return Promise.reject({
      type: 'GET_PROJECTS_FAIL',
      error,
    });
  }
};

// Updates a project
export const updateProject = async (project: any, projectID: string): Promise<ApiResponse> => {
  const requestString = `${BACKEND_BASE_URL}/projects/${projectID}`;
  try {
    return await axios
      .put(requestString, {
        ...project,
      });
  } catch (error) {
    return Promise.reject({
      type: 'UPDATE_PROJECT_FAIL',
      error,
    });
  }
};
