// @flow
import React, { useState, useEffect } from 'react';
import type { Node } from 'react';
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
  Icon,
  Form,
  Dropdown,
  Grid,
  Card,
  Message,
  Checkbox,
} from 'semantic-ui-react';
import 'draft-js/dist/Draft.css';
import { useHistory, useParams, Redirect } from 'react-router-dom';

import EditorToolbar from '../components/notes/EditorToolbar';
import Page from '../components/layout/Page';
import Loading from '../components/ui/Loading';
import {
  getNote,
  createNote,
  updateNote,
  deleteNote,
  getMembers,
  getMemberAliases,
  getNoteLabels,
  endUserSession,
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

/**
 * @constant
 * @type {Object}
 */
const SUBMIT_STATE = Object.freeze({
  error: 'error',
  start: 'start',
  success: 'success',
});

type DisplayListProps = {
  subList: Array<any>,
  parentList: Array<any>,
};

/**
 * Helper component to render a comma separated list
 * with the interface as the dropdown menu for view-only
 * enums
 *
 * @param {*} props
 * @returns
 */
const DisplayList = ({ subList, parentList }: DisplayListProps) => (
  <p style={{ color: 'grey', fontWeight: 'normal' }}>
    {
      // TODO: Remove inline styles in favor of external CSS
    }{' '}
    {subList
      .map((id) => {
        const idx = parentList.findIndex((m) => m.value === id);
        if (idx !== -1) return parentList[idx].text;
        return null;
      })
      .join(', ')}
  </p>
);

type NoteProps = {
  user: {
    _id: string,
    firstName: string,
  },
};

const Note = ({ user }: NoteProps): Node => {
  const [noteState, setNoteState] = useState(NOTE_STATE.loading);
  const [submitState, setSubmitState] = useState(SUBMIT_STATE.start);

  // TODO! Merge view/edit mode into noteState enum
  const [isEditable, setIsEditable] = useState(false);

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
  const [encryptNote, setEncryptNote] = useState(true);
  const [lastVersion, setLastVersion] = useState(null);

  // TODO: Implement safety guards for leaving an edited form
  // We can use a window.confirm() here or a semantic modal instead
  // const [hasEdited, setHasEdited] = useState(false);

  // referenced data
  const [members, setMembers] = useState([]);
  const [allNoteLabels, setAllNoteLabels] = useState([]);

  const [isFetching, setIsFetching] = useState(false);

  const history = useHistory();

  useEffect(() => {
    const init = async () => {
      // if note is not new request template
      // data for editing an existing note
      if (noteID !== 'new') {
        const resp = await getNote(noteID);
        if (resp.error && resp.error.response.status === 403) {
          const logout = await endUserSession();
          if (!logout.error) history.push('/login');
          return;
        }
        const currentNote = resp.data.result;
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
              versionHistory,
            },
            content,
            encrypt,
          } = currentNote;

          // TODO! Migrate to Form library for validation + modeling
          setNoteTitle(title);
          setNoteLabels(labels);
          setReferencedMembers(currentReferencedMembers.map((m) => m.memberId));
          setViewableBy(currentViewableBy.map((m) => m.memberId));
          setEditableBy(currentEditableBy.map((m) => m.memberId));
          setEncryptNote(encrypt);
          setLastVersion(versionHistory[versionHistory.length - 1]);

          // check if current user is in editor list
          if (
            currentEditableBy.findIndex((m) => m.memberId === user._id) > -1
          ) {
            setIsEditable(true);
          }

          setEditorState(
            EditorState.createWithContent(convertFromRaw(JSON.parse(content))),
          );
        } else {
          // otherwise bounce the client back to the previous page
          setNoteState(NOTE_STATE.error);
        }
      } else {
        setIsEditable(true);
        setNoteState(NOTE_STATE.creating);
      }

      // get member data for dropdown reference
      const allMembers = await getMembers();

      // map allMembers into a dropdown-friendly interface and remove the current user from the list
      const cleanedMembers = (allMembers?.data?.result ?? []).map((m) => ({
        key: m._id,
        text: `${m.firstName} ${m.lastName}`,
        value: m._id,
      }));

      // get alias types
      const memberAliases = await getMemberAliases();

      const cleanedMemberAliases = (memberAliases?.data?.result ?? []).map(
        (m) => ({
          key: m,
          text: m,
          value: m,
        }),
      );

      setMembers([...cleanedMemberAliases, ...cleanedMembers]);

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
  }, [noteID, user, history]);

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
    if (!isEditable) {
      return;
    }

    setIsFetching(true);

    // check if this note has a valid title, at least one referenced member,
    // and a valid editor state
    if (
      (noteState && !validateEditorState(editorState)) ||
      !noteTitle ||
      !referencedMembers
    ) {
      setSubmitState(SUBMIT_STATE.error);
      return;
    }

    setSubmitState(SUBMIT_STATE.start);
    (noteState === NOTE_STATE.editing ? updateNote : createNote)(
      {
        content: JSON.stringify(convertToRaw(editorState.getCurrentContent())),
        encrypt: encryptNote,
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
      .then((res) => {
        setSubmitState(SUBMIT_STATE.success);
        setIsFetching(false);
        history.push(`/notes/${res.data.data._id}`);
        return res;
      })
      .catch(() => setSubmitState(SUBMIT_STATE.error));
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

  const handleDeleteNote = async () => {
    const resp = await deleteNote(noteID);
    if (resp.error) setSubmitState(SUBMIT_STATE.error);
    else history.push('/notes');
  };

  switch (noteState) {
    case NOTE_STATE.loading:
      return <Loading height={500} />;
    case NOTE_STATE.error:
      return <Redirect to="/notes" />;
    default:
      return (
        <Page
          title={`${titleCaseFormatter(NOTE_STATE[noteState])} a Note`}
          menuItems={
            isEditable && (
              <Button negative onClick={handleDeleteNote}>
                <Icon name="x" /> Delete
              </Button>
            )
          }
        >
          <Form>
            <Grid stackable>
              <Grid.Column width={12}>
                <Card fluid>
                  <Card.Content>
                    <Card.Header>Content</Card.Header>
                    <Form.Field>
                      <label>
                        Note Title
                        {!isEditable ? (
                          <h2>{noteTitle}</h2>
                        ) : (
                          <Input
                            value={noteTitle ?? ''}
                            placeholder="Mid-semester 2:1"
                            onChange={(e) => setNoteTitle(e.target.value ?? '')}
                          />
                        )}
                      </label>
                    </Form.Field>
                    <Form.Field>
                      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                      <label>Note Contents</label>
                      {isEditable && (
                        <EditorToolbar
                          handleRichStyle={handleRichStyle}
                          handleBlockType={handleBlockType}
                        />
                      )}
                      <Editor
                        readOnly={!isEditable}
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
                        Note Labels
                        {isEditable ? (
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
                        ) : (
                          <DisplayList
                            subList={noteLabels}
                            parentList={allNoteLabels}
                          />
                        )}
                      </label>
                    </Form.Field>
                    <Form.Field>
                      <label>
                        Referenced Members
                        {isEditable ? (
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
                        ) : (
                          <DisplayList
                            subList={referencedMembers}
                            parentList={members}
                          />
                        )}
                      </label>
                    </Form.Field>
                    <Form.Field>
                      <label>
                        Viewable By
                        {isEditable ? (
                          <Dropdown
                            value={viewableBy}
                            placeholder="Albert Cao, etc"
                            onChange={(_, { value }) => setViewableBy(value)}
                            fluid
                            multiple
                            search
                            selection
                            options={members.filter((m) => m.key !== user._id)}
                          />
                        ) : (
                          <DisplayList
                            subList={viewableBy}
                            parentList={members}
                          />
                        )}
                      </label>
                    </Form.Field>
                    <Form.Field>
                      <label>
                        Editable By
                        {isEditable ? (
                          <Dropdown
                            value={editableBy}
                            onChange={(_, { value }) => setEditableBy(value)}
                            fluid
                            multiple
                            search
                            selection
                            options={members.filter((m) => m.key !== user._id)}
                          />
                        ) : (
                          <DisplayList
                            subList={editableBy}
                            parentList={members}
                          />
                        )}
                      </label>
                    </Form.Field>
                    <Form.Field>
                      <label>
                        Encrypt Note
                        {isEditable ? (
                          <Checkbox
                            checked={encryptNote}
                            onClick={(_, data) => setEncryptNote(data.checked)}
                          />
                        ) : (
                          <Checkbox checked={encryptNote} readOnly />
                        )}
                      </label>
                    </Form.Field>
                  </Card.Content>
                </Card>
                {isEditable && (
                  <Button
                    primary
                    fluid
                    onClick={submitNote}
                    disabled={isFetching}
                  >
                    {noteState === NOTE_STATE.editing ? 'Update' : 'Create'}{' '}
                    Note
                  </Button>
                )}
                {submitState === SUBMIT_STATE.error && (
                  <Message negative>
                    {
                      // TODO: Add specific error messages
                    }
                    <p>Error with submission.</p>
                  </Message>
                )}
                {submitState === SUBMIT_STATE.success && (
                  <Message color="green" content="Successfully submitted!" />
                )}
                {lastVersion && (
                  <div id="last-edited-text">
                    <p>{`Last edited by ${
                      members.find((m) => m.key === lastVersion.memberID)
                        ?.text ?? ''
                    } on ${new Date(lastVersion.date).toDateString()}`}</p>
                  </div>
                )}
              </Grid.Column>
            </Grid>
          </Form>
        </Page>
      );
  }
};

export default Note;
