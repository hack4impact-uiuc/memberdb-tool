// @flow
import React, { useState, useEffect } from 'react';
import { Editor, EditorState, RichUtils } from 'draft-js';
import { Button, Input, Form, Dropdown } from 'semantic-ui-react';
import 'draft-js/dist/Draft.css';
import { useParams, Redirect } from 'react-router-dom';

import {
  getNotes,
  createNote,
  updateNote,
  getMembers,
  getNoteLabels,
} from '../utils/apiWrapper';

import '../css/Note.css';

/**
 * @constant
 * @type {Object}
 */
const NOTE_STATE = Object.freeze({
  loading: 'loading',
  updating: 'updating',
  creating: 'creating',
  error: 'error',
});

function Note() {
  // note state
  const [noteState, setNoteState] = useState(NOTE_STATE.loading);

  // routing
  const { noteID } = useParams();

  // form data
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty(),
  );
  const [noteTitle, setNoteTitle] = useState(null);
  const [noteLabels, setNoteLabels] = useState([]);
  const [referencedMembers, setReferencedMembers] = useState([]);

  // TODO: Implement safety guards for leaving an edited form
  // We can use a window.confirm() here or a semantic modal instead
  // const [hasEdited, setHasEdited] = useState(false);

  // referenced data
  const [members, setMembers] = useState([]);
  const [allNoteLabels, setAllNoteLabels] = useState([]);

  useEffect(() => {
    const init = async () => {
      // if note is not new request template
      // data for editing an existing note
      if (noteID !== 'new') {
        const {
          data: { result },
        } = await getNotes();

        // see if the URL param ID matches an existing note
        const currentNote = result.find((note) => note._id === noteID);
        if (currentNote) {
          setNoteState(NOTE_STATE.editing);
          const {
            metaData: { title, labels },
          } = currentNote;
          setNoteTitle(title);
          setNoteLabels(labels);
        } else {
          // otherwise bounce the client back to the previous page
          setNoteState(NOTE_STATE.error);
        }
      } else {
        setNoteState(NOTE_STATE.creating);
      }

      // get member data for dropdown reference
      const allMembers = await getMembers();
      // map allMembers into a dropdown-friendly interface
      const cleanedMembers =
        allMembers?.data?.result?.map((m) => ({
          key: m._id,
          text: `${m.firstName} ${m.lastName}`,
          value: m._id,
        })) ?? [];
      setMembers(cleanedMembers);

      const resNoteLabels = await getNoteLabels();
      const cleanedNoteLabels =
        resNoteLabels?.data?.result?.map((l) => ({
          key: l,
          text: l,
          value: l,
        })) ?? [];
      setAllNoteLabels(cleanedNoteLabels);
    };
    init();
  }, [noteID]);

  /**
   * handles shortcuts to format rich text
   *
   * @param {*} command
   * @param {*} currentEditorState
   * @returns {'handled' | 'not-handled'}
   */
  function handleKeyCommand(command, currentEditorState) {
    const newState = RichUtils.handleKeyCommand(currentEditorState, command);

    if (newState) {
      setEditorState(newState);
      return 'handled';
    }

    return 'not-handled';
  }

  /**
   * does this EditorState have valid contents
   *
   * @param {*} currentEditorState
   * @returns {boolean}
   */
  const validateEditorState = (currentEditorState) =>
    currentEditorState.getCurrentContent().hasText();

  /**
   * update or creates a note with the current
   * form data if valid
   *
   * @returns {undefined}
   */
  const submitNote = () => {
    // check if this note has a valid title, at least one referenced member,
    // and a valid editor state
    if (
      (noteState && !validateEditorState(editorState)) ||
      !noteTitle ||
      !referencedMembers
    ) {
      // TODO! Add error feedback for bad validation
      return;
    }

    (noteState === NOTE_STATE.editing ? updateNote : createNote)(
      {
        content: editorState.getCurrentContent().getPlainText(),
        metaData: {
          title: noteTitle,
          labels: noteLabels,
          referencedMembers,
        },
      },
      noteID,
    )
      .then((res) => console.log(res))
      .catch((e) => console.error(e));
  };

  switch (noteState) {
    case NOTE_STATE.loading:
      return <>Loading...</>;
    case NOTE_STATE.error:
      return <Redirect to="/notes" />;
    default:
      return (
        <div className="note-wrapper">
          <Form>
            <Form.Field>
              <label>
                Note Title
                <Input
                  value={noteTitle ?? ''}
                  placeholder="Mid-semester 2:1"
                  onChange={(e) => setNoteTitle(e.target.value ?? '')}
                />
              </label>
            </Form.Field>
            <Form.Field>
              <label>
                Note Label
                <Dropdown
                  id="note-labels"
                  value={noteLabels}
                  placeholder="1v1, evaluation, etc"
                  onChange={(_, { value }) => setNoteLabels(value)}
                  fluid
                  multiple
                  search
                  selection
                  options={allNoteLabels}
                />
              </label>
            </Form.Field>
            <Form.Field>
              <label>
                Referenced Members
                <Dropdown
                  placeholder="Albert Cao, etc"
                  onChange={(_, { value }) => setReferencedMembers(value)}
                  fluid
                  multiple
                  search
                  selection
                  options={members}
                />
              </label>
            </Form.Field>
            <Form.Field>
              <label>
                Note Contents
                <Editor
                  editorState={editorState}
                  handleKeyCommand={handleKeyCommand}
                  onChange={setEditorState}
                />
              </label>
            </Form.Field>
            <br />
            <Button primary onClick={submitNote}>
              {noteState === NOTE_STATE.editing ? 'Update' : 'Create'} Note
            </Button>
          </Form>
        </div>
      );
  }
}

export default Note;
