// @flow
import React, { useState, useEffect } from 'react';
import { useParams, Redirect } from 'react-router-dom';
import { Form, Message, Icon, Button, Card, Grid } from 'semantic-ui-react';
import _ from 'lodash';

import Page from '../components/layout/Page';
import TextAttribute from '../components/EditableAttribute/TextAttribute';
import EnumAttribute from '../components/EditableAttribute/EnumAttribute';
import '../css/Profile.css';
import {
  getMemberByID,
  getMemberEnumOptions,
  getMemberPermissionsByID,
  getMemberSchemaTypes,
  updateMember,
  createMember,
} from '../utils/apiWrapper';
import { requiredFields } from '../utils/consts';

/**
 * @constant
 * @type {number}
 */
const SUCCESS_MESSAGE_POPUP_TIME_MS = 4000;

/**
 * Checks if the given API responses were successful
 * @param  {...any} responses Any amount of response objects
 */
const areResponsesSuccessful = (...responses) => {
  let success = true;
  responses.forEach((response) => {
    if (response == null || response.data == null || !response.data.success)
      success = false;
  });

  return success;
};

const Profile = () => {
  const { memberID } = useParams();
  const newUser = memberID === 'new';
  const [newUserID, setNewUserID] = useState(false);

  // Upstream user is the DB version. Local user captures local changes made to the user.
  const [upstreamUser, setUpstreamUser] = useState({});
  const [localUser, setLocalUser] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [enumOptions, setEnumOptions] = useState({});
  // const [schemaTypes, setSchemaTypes] = useState({});
  const [userPermissions, setUserPermissions] = useState({
    view: [],
    edit: [],
  });

  useEffect(() => {
    async function getUserData() {
      if (memberID == null) return;

      const responses = [];

      let memberDataResponse = null;
      if (!newUser) {
        memberDataResponse = await getMemberByID(memberID);
        responses.push(memberDataResponse);
      }

      const memberPermissionResponse = await getMemberPermissionsByID(memberID);
      const memberSchemaResponse = await getMemberSchemaTypes();
      const enumOptionsResponse = await getMemberEnumOptions();
      responses.push(
        enumOptionsResponse,
        memberSchemaResponse,
        memberPermissionResponse,
      );

      if (!areResponsesSuccessful(...responses)) {
        setErrorMessage('An error occurred while retrieving member data.');
        return;
      }

      if (!newUser && memberDataResponse !== null) {
        setUpstreamUser(memberDataResponse.data.result);
        setLocalUser(memberDataResponse.data.result);
      }
      setUserPermissions(memberPermissionResponse.data.result);
      // setSchemaTypes(memberSchemaResponse.data.result);
      setEnumOptions(enumOptionsResponse.data.result);
      setErrorMessage(null);
    }

    getUserData();
  }, [memberID, newUser]);

  // Returns true if the member attribute is of the given type.
  // Type is a string defined by mongoose. See https://mongoosejs.com/docs/schematypes.html
  // const isOfType = (attribute, type) => {
  //   if (!schemaTypes || !type || !schemaTypes[type]) return false;

  //   return schemaTypes[type].includes(attribute);
  // };

  const onAttributeChange = (value, attributeLabel) => {
    setLocalUser({
      ...localUser,
      [attributeLabel]: value,
    });
  };

  const createUpdatedUser = () => {
    const updatedUser = {};
    userPermissions.edit.forEach((field) => {
      updatedUser[field] = localUser[field];
    });

    return updatedUser;
  };

  const setTemporarySuccessMessage = (contents) => {
    setSuccessMessage(contents);
    setTimeout(() => setSuccessMessage(null), SUCCESS_MESSAGE_POPUP_TIME_MS);
  };

  const submitChanges = async () => {
    let missingFields = false;
    requiredFields.forEach((field) => {
      if (!localUser[field]) {
        missingFields = true;
      }
    });
    if (missingFields) return;

    const result = newUser
      ? await createMember(createUpdatedUser())
      : await updateMember(createUpdatedUser(), upstreamUser._id);
    if (!areResponsesSuccessful(result)) {
      setErrorMessage(
        `An error occured${
          result &&
          result.error &&
          result.error.response &&
          result.error.response.data
            ? `: ${result.error.response.data.message}`
            : '.'
        }`,
      );
      setSuccessMessage(null);
    } else {
      setTemporarySuccessMessage(newUser ? 'User Created' : 'User updated');
      setErrorMessage(null);
      setUpstreamUser(result.data.result);
      if (newUser) setNewUserID(result.data.result._id);
    }
  };

  // const defaultDropdownOption = { text: '', value: '' };

  // const getOptionFromValue = (valueOptions = [], val) => {
  //   const dropdownOption = valueOptions.find((option) => option.value === val);
  //   if (dropdownOption) {
  //     return dropdownOption;
  //   }

  //   return defaultDropdownOption;
  // };

  return (
    <div className="profile-page">
      <Page title="Profile">
        {/* Redirects to the new member page immediately after creating and getting a success response */}
        {newUserID && <Redirect to={`/member/${newUserID}`} />}
        <Card fluid raised className="profile-card">
          <Card.Content>
            <Card.Header style={{ marginBottom: 10 }}>
              <h2>
                {`${upstreamUser.firstName} ${upstreamUser.lastName}`}
                <span
                  style={{ fontSize: '13px', opacity: 0.8, marginLeft: '20px' }}
                >
                  {upstreamUser.level}
                </span>
              </h2>
            </Card.Header>
            <Form fluid className="profile-form" onSubmit={submitChanges}>
              <Grid columns="equal">
                <Grid.Row className="row">
                  <Grid.Column>
                    <TextAttribute
                      type="text"
                      value={localUser.firstName}
                      key="firstName"
                      attributeLabel="firstName"
                      className="attribute"
                      onChange={onAttributeChange}
                      isDisabled={!userPermissions.edit.includes('firstName')}
                      isRequired={requiredFields.includes('firstName')}
                    />
                  </Grid.Column>
                  <Grid.Column>
                    <TextAttribute
                      type="text"
                      value={localUser.lastName}
                      key="lastName"
                      attributeLabel="lastName"
                      className="attribute"
                      onChange={onAttributeChange}
                      isDisabled={!userPermissions.edit.includes('lastName')}
                      isRequired={requiredFields.includes('lastName')}
                    />
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row className="row">
                  <Grid.Column>
                    <TextAttribute
                      type="text"
                      value={localUser.email}
                      key="email"
                      attributeLabel="email"
                      className="attribute"
                      onChange={onAttributeChange}
                      isDisabled={!userPermissions.edit.includes('email')}
                      isRequired={requiredFields.includes('email')}
                    />
                  </Grid.Column>
                  <Grid.Column>
                    <Grid columns="equal">
                      <Grid.Column>
                        <EnumAttribute
                          value={localUser.gradSemester}
                          valueOptions={enumOptions.gradSemester}
                          key="gradSemester"
                          attributeLabel="gradSemester"
                          className="attribute"
                          onChange={onAttributeChange}
                          isDisabled={
                            !userPermissions.edit.includes('gradSemester')
                          }
                        />
                      </Grid.Column>
                      <Grid.Column>
                        <TextAttribute
                          type="number"
                          value={localUser.gradYear}
                          key="gradYear"
                          attributeLabel="gradYear"
                          className="attribute"
                          onChange={onAttributeChange}
                          isDisabled={
                            !userPermissions.edit.includes('gradYear')
                          }
                          isRequired={requiredFields.includes('gradYear')}
                        />
                      </Grid.Column>
                    </Grid>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row className="row">
                  <Grid.Column>
                    <EnumAttribute
                      value={localUser.chapter}
                      valueOptions={enumOptions.chapter}
                      key="chapter"
                      attributeLabel="chapter"
                      className="attribute"
                      onChange={onAttributeChange}
                      isDisabled={!userPermissions.edit.includes('chapter')}
                    />
                  </Grid.Column>
                  <Grid.Column>
                    <EnumAttribute
                      value={localUser.role}
                      valueOptions={enumOptions.role}
                      key="role"
                      attributeLabel="role"
                      className="attribute"
                      onChange={onAttributeChange}
                      isDisabled={!userPermissions.edit.includes('role')}
                    />
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row className="row">
                  <Grid.Column>
                    <EnumAttribute
                      value={localUser.status}
                      valueOptions={enumOptions.status}
                      key="status"
                      attributeLabel="status"
                      className="attribute"
                      onChange={onAttributeChange}
                      isDisabled={!userPermissions.edit.includes('status')}
                    />
                  </Grid.Column>
                  <Grid.Column>
                    <Grid columns="equal">
                      <Grid.Column>
                        <EnumAttribute
                          value={localUser.generationSemester}
                          valueOptions={enumOptions.generationSemester}
                          key="generationSemester"
                          attributeLabel="generationSemester"
                          className="attribute"
                          onChange={onAttributeChange}
                          isDisabled={
                            !userPermissions.edit.includes('generationSemester')
                          }
                        />
                      </Grid.Column>
                      <Grid.Column>
                        <TextAttribute
                          type="number"
                          value={localUser.generationYear}
                          key="generationYear"
                          attributeLabel="generationYear"
                          className="attribute"
                          onChange={onAttributeChange}
                          isDisabled={
                            !userPermissions.edit.includes('generationYear')
                          }
                          isRequired={requiredFields.includes('generationYear')}
                        />
                      </Grid.Column>
                    </Grid>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row className="row">
                  <Grid.Column>
                    <TextAttribute
                      type="text"
                      value={localUser.instagram}
                      key="instagram"
                      attributeLabel="instagram"
                      className="attribute"
                      onChange={onAttributeChange}
                      isDisabled={!userPermissions.edit.includes('instagram')}
                      isRequired={requiredFields.includes('instagram')}
                    />
                  </Grid.Column>
                  <Grid.Column>
                    <TextAttribute
                      type="text"
                      value={localUser.snapchat}
                      key="snapchat"
                      attributeLabel="snapchat"
                      className="attribute"
                      onChange={onAttributeChange}
                      isDisabled={!userPermissions.edit.includes('snapchat')}
                      isRequired={requiredFields.includes('snapchat')}
                    />
                  </Grid.Column>
                  <Grid.Column>
                    <TextAttribute
                      type="text"
                      value={localUser.github}
                      key="github"
                      attributeLabel="github"
                      className="attribute"
                      onChange={onAttributeChange}
                      isDisabled={!userPermissions.edit.includes('github')}
                      isRequired={requiredFields.includes('github')}
                    />
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row className="row">
                  <Grid.Column>
                    <Form.TextArea
                      style={{ minHeight: 100, maxHeight: 100 }}
                      label="NOTES"
                      fluid
                    />
                  </Grid.Column>
                </Grid.Row>
              </Grid>

              {
                // Message displayed upon successfully updating member
                successMessage ? (
                  <div className="profile-alert">
                    <Message icon big positive>
                      <Icon name="thumbs up" />
                      <Message.Content>
                        <Message.Header>
                          {newUser ? 'Create User' : 'Update'} Succeeded!
                        </Message.Header>
                        {successMessage}
                      </Message.Content>
                    </Message>
                  </div>
                ) : (
                  <div />
                )
              }

              {
                // Message displayed upon receiving an error response
                errorMessage !== null && errorMessage !== undefined ? (
                  <div className="profile-alert">
                    <Message className="profile-alert" icon big negative>
                      <Icon name="warning circle" />
                      <Message.Content>
                        <Message.Header>
                          {newUser ? 'Create User' : 'Update'} Failed!
                        </Message.Header>
                        {errorMessage}
                      </Message.Content>
                    </Message>
                  </div>
                ) : (
                  <div />
                )
              }

              {userPermissions.edit.length > 0 ? (
                <div id="submit-button">
                  <Button
                    size="big"
                    disabled={_.isEqual(upstreamUser, localUser)}
                    type="large"
                    onClick={submitChanges}
                  >
                    {newUser ? 'Create User' : 'Update'}
                  </Button>
                </div>
              ) : (
                <div />
              )}
            </Form>
          </Card.Content>
        </Card>
      </Page>
    </div>
  );
};

export default Profile;
