// @flow
import React, { useState, useEffect } from 'react';
import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
} from 'draft-js';
import {
  Button,
  Input,
  Form,
  Dropdown,
  Grid,
  Card,
  Message,
} from 'semantic-ui-react';
import 'draft-js/dist/Draft.css';
import PropTypes from 'prop-types';
import { useParams, Redirect } from 'react-router-dom';

import EditorToolbar from '../components/notes/EditorToolbar';
import Page from '../components/layout/Page';
import Loading from '../components/ui/Loading';
import {
  getNotes,
  createNote,
  updateNote,
  getMembers,
  getNoteLabels,
} from '../utils/apiWrapper';
import { titleCaseFormatter } from '../utils/formatters';

import '../css/Note.css';

/**
 * @constant
 * @type {Object}
 */
const NOTE_STATE = Object.freeze({
  loading: 'loading',
  editing: 'editing',
  creating: 'creating',
  error: 'error',
});

const Note = ({ user }) => {
  // note state
  const [noteState, setNoteState] = useState(NOTE_STATE.loading);
  const [submitError, setSubmitError] = useState(false);

  // routing
  const { noteID } = useParams();

  // form data
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty(),
  );
  const [noteTitle, setNoteTitle] = useState(null);
  const [noteLabels, setNoteLabels] = useState([]);
  const [referencedMembers, setReferencedMembers] = useState([]);
  const [viewableBy, setViewableBy] = useState([]);
  const [editableBy, setEditableBy] = useState([]);

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
            metaData: {
              title,
              labels,
              referencedMembers: currentReferencedMembers,
              access: {
                editableBy: currentEditableBy,
                viewableBy: currentViewableBy,
              },
            },
            content,
          } = currentNote;

          // TODO! Migrate to Form library for validation + modeling
          setNoteTitle(title);
          setNoteLabels(labels);
          setReferencedMembers(currentReferencedMembers.map((m) => m.memberId));
          setViewableBy(currentViewableBy.map((m) => m.memberId));
          setEditableBy(currentEditableBy.map((m) => m.memberId));
          setEditorState(
            EditorState.createWithContent(convertFromRaw(JSON.parse(content))),
          );
        } else {
          // otherwise bounce the client back to the previous page
          setNoteState(NOTE_STATE.error);
        }
      } else {
        setNoteState(NOTE_STATE.creating);
      }

      // get member data for dropdown reference
      const allMembers = await getMembers();

      // map allMembers into a dropdown-friendly interface and remove the current user from the list
      const cleanedMembers = (allMembers?.data?.result ?? [])
        .filter((m) => m._id !== user._id)
        .map((m) => ({
          key: m._id,
          text: `${m.firstName} ${m.lastName}`,
          value: m._id,
        }));
      setMembers(cleanedMembers);

      const resNoteLabels = await getNoteLabels();
      const cleanedNoteLabels = (resNoteLabels?.data?.result ?? []).map(
        (l) => ({
          key: l,
          text: l,
          value: l,
        }),
      );
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
      setSubmitError(true);
      return;
    }

    (noteState === NOTE_STATE.editing ? updateNote : createNote)(
      {
        content: JSON.stringify(convertToRaw(editorState.getCurrentContent())),
        metaData: {
          title: noteTitle,
          labels: noteLabels,
          referencedMembers,
          access: {
            editableBy,
            viewableBy,
          },
        },
      },
      noteID,
    )
      .then(() => setSubmitError(false))
      .catch(() => setSubmitError(true));
  };

  /**
   * Handles toggling the received rich inline style
   * @param {string} richStyle
   */
  function handleRichStyle(richStyle) {
    const newState = RichUtils.toggleInlineStyle(editorState, richStyle);
    if (newState) setEditorState(newState);
  }

  /**
   * Handles toggling the received block type
   * @param {string} blockType
   */
  function handleBlockType(blockType) {
    const newState = RichUtils.toggleBlockType(editorState, blockType);
    if (newState) setEditorState(newState);
  }

  switch (noteState) {
    case NOTE_STATE.loading:
      return <Loading height={500} />;
    case NOTE_STATE.error:
      return <Redirect to="/notes" />;
    default:
      return (
        <Page title={`${titleCaseFormatter(NOTE_STATE[noteState])} a Note`}>
          <Form>
            <Grid stackable>
              <Grid.Column width={12}>
                <Card fluid>
                  <Card.Content>
                    <Card.Header>Content</Card.Header>
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
                      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                      <label>Note Contents</label>
                      <EditorToolbar
                        handleRichStyle={handleRichStyle}
                        handleBlockType={handleBlockType}
                      />
                      <Editor
                        editorState={editorState}
                        handleKeyCommand={handleKeyCommand}
                        onChange={setEditorState}
                      />
                    </Form.Field>
                  </Card.Content>
                </Card>
              </Grid.Column>
              <Grid.Column width={4}>
                <Card fluid>
                  <Card.Content>
                    <Card.Header>Metadata</Card.Header>
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
                          value={referencedMembers}
                          placeholder="Albert Cao, etc"
                          onChange={(_, { value }) =>
                            setReferencedMembers(value)
                          }
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
                        Viewable By
                        <Dropdown
                          value={viewableBy}
                          placeholder="Albert Cao, etc"
                          onChange={(_, { value }) => setViewableBy(value)}
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
                        Editable By
                        <Dropdown
                          value={editableBy}
                          placeholder="Albert Cao, etc"
                          onChange={(_, { value }) => setEditableBy(value)}
                          fluid
                          multiple
                          search
                          selection
                          options={members}
                        />
                      </label>
                    </Form.Field>
                  </Card.Content>
                </Card>
                <Button primary fluid onClick={submitNote}>
                  {noteState === NOTE_STATE.editing ? 'Update' : 'Create'} Note
                </Button>
                {submitError && (
                  <Message negative>
                    {
                      // TODO: Add specific error messages
                    }
                    <p>Error with submission.</p>
                  </Message>
                )}
              </Grid.Column>
            </Grid>
          </Form>
        </Page>
      );
  }
};

Note.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    firstName: PropTypes.string,
  }).isRequired,
};

export default Note;
