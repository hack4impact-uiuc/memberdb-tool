import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Form, Message, Icon, Button } from 'semantic-ui-react';
import _ from 'lodash';

import TextAttribute from '../components/EditableAttribute/TextAttribute';
import EnumAttribute from '../components/EditableAttribute/EnumAttribute';
import BooleanAttribute from '../components/EditableAttribute/BooleanAttribute';
import DateAttribute from '../components/EditableAttribute/DateAttribute';
import '../css/Profile.css';
import {
  getMemberByID,
  getMemberEnumOptions,
  getMemberPermissionsByID,
  getMemberSchemaTypes,
  updateMember,
} from '../utils/apiWrapper';

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

  // Upstream user is the DB version. Local user captures local changes made to the user.
  const [upstreamUser, setUpstreamUser] = useState({});
  const [localUser, setLocalUser] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [enumOptions, setEnumOptions] = useState({});
  const [schemaTypes, setSchemaTypes] = useState({});
  const [userPermissions, setUserPermissions] = useState({
    view: [],
    edit: [],
  });
  const [newUser, setNewUser] = useState(false);

  useEffect(() => {
    async function getUserData() {
      if (memberID == null) return;
      if (memberID == 'new') setNewUser(true);

      let responses = [];

      let memberDataResponse;
      let memberPermissionResponse;
      if (memberID !== 'new') {
        memberDataResponse = await getMemberByID(memberID);
        memberPermissionResponse = await getMemberPermissionsByID(memberID);
        responses.push(memberDataResponse, memberPermissionResponse);
      }
      const memberSchemaResponse = await getMemberSchemaTypes();
      const enumOptionsResponse = await getMemberEnumOptions();
      responses.push(enumOptionsResponse, memberSchemaResponse);

      if (!areResponsesSuccessful(...responses)) {
        setErrorMessage('An error occurred while retrieving member data.');
        return;
      }

      if (memberID !== 'new') {
        setUpstreamUser(memberDataResponse.data.result);
        setLocalUser(memberDataResponse.data.result);
        setUserPermissions(memberPermissionResponse.data.result);
      }
      setSchemaTypes(memberSchemaResponse.data.result);
      setEnumOptions(enumOptionsResponse.data.result);
      setErrorMessage(null);
    }

    getUserData();
  }, [memberID]);

  // Returns true if the member attribute is of the given type.
  // Type is a string defined by mongoose. See https://mongoosejs.com/docs/schematypes.html
  const isOfType = (attribute, type) => {
    if (!schemaTypes || !type || !schemaTypes[type]) return false;

    return schemaTypes[type].includes(attribute);
  };

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
    const result = await updateMember(createUpdatedUser(), upstreamUser._id);
    if (!areResponsesSuccessful(result)) {
      setErrorMessage(
        `An error occured${
          result && result.data && result.data.message
            ? `: ${result.data.message}`
            : '.'
        }`,
      );
      setSuccessMessage(null);
    } else {
      setTemporarySuccessMessage('User updated');
      setErrorMessage(null);
      setUpstreamUser(result.data.result);
    }
  };

  return (
    <>
      <Form size="big" className="profile-form">
        {
          // Main content
          userPermissions.view.map((attribute) => {
            if (isOfType(attribute, 'Number')) {
              return (
                <TextAttribute
                  type="number"
                  value={localUser[attribute]}
                  key={attribute}
                  attributeLabel={attribute}
                  className="attribute"
                  onChange={onAttributeChange}
                  isDisabled={!userPermissions.edit.includes(attribute)}
                />
              );
            }

            if (isOfType(attribute, 'Enum')) {
              return (
                <EnumAttribute
                  value={localUser[attribute]}
                  valueOptions={enumOptions[attribute]}
                  key={attribute}
                  attributeLabel={attribute}
                  className="attribute"
                  onChange={onAttributeChange}
                  isDisabled={!userPermissions.edit.includes(attribute)}
                />
              );
            }

            if (isOfType(attribute, 'Boolean')) {
              return (
                <BooleanAttribute
                  value={localUser[attribute]}
                  key={attribute}
                  attributeLabel={attribute}
                  className="attribute"
                  onChange={onAttributeChange}
                  isDisabled={!userPermissions.edit.includes(attribute)}
                />
              );
            }

            if (isOfType(attribute, 'Date')) {
              return (
                <DateAttribute
                  value={Date.parse(localUser[attribute])}
                  key={attribute}
                  attributeLabel={attribute}
                  onChange={onAttributeChange}
                  className="attribute"
                  isDisabled={!userPermissions.edit.includes(attribute)}
                />
              );
            }

            if (isOfType(attribute, 'String')) {
              return (
                <TextAttribute
                  type="text"
                  value={localUser[attribute]}
                  attributeLabel={attribute}
                  className="attribute"
                  key={attribute}
                  onChange={onAttributeChange}
                  isDisabled={!userPermissions.edit.includes(attribute)}
                />
              );
            }

            return <div key={attribute} />;
          })
        }
      </Form>

      {
        // Message displayed upon successfully updating member
        successMessage ? (
          <div className="profile-alert">
            <Message icon big positive>
              <Icon name="thumbs up" />
              <Message.Content>
                <Message.Header>Update Succeeded!</Message.Header>
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
        errorMessage ? (
          <div className="profile-alert">
            <Message className="profile-alert" icon big negative>
              <Icon name="warning circle" />
              <Message.Content>
                <Message.Header>Update Failed!</Message.Header>
                {errorMessage}
              </Message.Content>
            </Message>
          </div>
        ) : (
          <div />
        )
      }

      {userPermissions.edit.length > 0 ? (
        <>
          <Button
            size="big"
            id="submit-button"
            disabled={_.isEqual(upstreamUser, localUser)}
            type="large"
            onClick={submitChanges}
          >
            Update
          </Button>
          <br />
        </>
      ) : (
        <div />
      )}
    </>
  );
};

export default Profile;
