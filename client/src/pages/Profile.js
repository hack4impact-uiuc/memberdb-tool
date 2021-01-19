import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Alert, Icon, Button } from '@hack4impact-uiuc/bridge';

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
  const [isError, setIsError] = useState(false);
  const [user, setUser] = useState({});
  const [enumOptions, setEnumOptions] = useState({});
  const [schemaTypes, setSchemaTypes] = useState({});
  const [userPermissions, setUserPermissions] = useState({
    view: [],
    edit: [],
  });

  useEffect(() => {
    async function getUserData() {
      if (memberID == null) return;

      const memberDataResponse = await getMemberByID(memberID);
      const memberPermissionResponse = await getMemberPermissionsByID(memberID);
      const memberSchemaResponse = await getMemberSchemaTypes();
      const enumOptionsResponse = await getMemberEnumOptions();

      if (
        !areResponsesSuccessful(
          memberDataResponse,
          memberPermissionResponse,
          memberSchemaResponse,
          enumOptionsResponse,
        )
      ) {
        setIsError(true);
        return;
      }

      setUser(memberDataResponse.data.result);
      setUserPermissions(memberPermissionResponse.data.result);
      setSchemaTypes(memberSchemaResponse.data.result);
      setEnumOptions(enumOptionsResponse.data.result);
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
    setUser({
      ...user,
      [attributeLabel]: value,
    });
  };

  const createUpdatedUser = () => {
    const updatedUser = {};
    userPermissions.edit.forEach((field) => {
      updatedUser[field] = user[field];
    });

    return updatedUser;
  };

  const submitChanges = () => {
    updateMember(createUpdatedUser(), user._id);
  };

  return (
    <div>
      {isError ? (
        <Alert variant="error" mb="8px">
          <Icon type="errorAlert" />
          An error occurred
        </Alert>
      ) : (
        userPermissions.view.map((attribute) => {
          if (isOfType(attribute, 'Number')) {
            return (
              <TextAttribute
                type="number"
                value={user[attribute]}
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
                value={user[attribute]}
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
                value={user[attribute]}
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
                value={Date.parse(user[attribute])}
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
                value={user[attribute]}
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
      )}
      {userPermissions.edit.length > 0 ? (
        <Button id="submit-button" type="large" onClick={submitChanges}>
          Update
        </Button>
      ) : (
        <div />
      )}
    </div>
  );
};

export default Profile;
