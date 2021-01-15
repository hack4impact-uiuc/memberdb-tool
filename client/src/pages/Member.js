import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Alert, Icon } from '@hack4impact-uiuc/bridge';
import StringAttribute from '../components/EditableAttribute/StringAttribute';
import EnumAttribute from '../components/EditableAttribute/EnumAttribute';
import {
  getMemberByID,
  getMemberEnumOptions,
  getMemberPermissionsByID,
  getMemberSchemaTypes,
} from '../utils/apiWrapper';
import BooleanAttribute from '../components/EditableAttribute/BooleanAttribute';
import DateAttribute from '../components/EditableAttribute/DateAttribute';

/**
 * Checks if the given API responses were successful
 * @param  {...any} responses Any amount of response objects
 */
const areResponsesSuccessful = (...responses) => {
  let success = true;
  responses.forEach(response => {
    if (response == null || response.data == null || !response.data.success)
      success = false;
  });

  return success;
};

/**
 * Parases/Returns the member ID from the URL
 * @param {String} url the current webpage url
 */
const parseMemberID = url => {
  const urlPartsArray = url.split('/'); // [BASE_URL, member, :memberID]
  const id = urlPartsArray.pop(); // removes the last element from array
  return id;
};

const Member = () => {
  let location = useLocation();
  const [memberID, setMemberID] = useState(null);
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
      console.log(memberID);
      if (memberID == null) return;

      let memberDataResponse = await getMemberByID(memberID);
      let memberPermissionResponse = await getMemberPermissionsByID(memberID);
      let memberSchemaResponse = await getMemberSchemaTypes();
      let enumOptionsResponse = await getMemberEnumOptions();

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

  useEffect(() => {
    setMemberID(parseMemberID(location.pathname));
  }, [location]);

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

  return (
    <div>
      {isError ? (
        <Alert variant="error" mb="8px">
          <Icon type="errorAlert" />
          An error occurred
        </Alert>
      ) : (
        userPermissions.view.map(attribute => {
          if (isOfType(attribute, 'Number'))
            return (
              <StringAttribute
                type="number"
                value={user[attribute]}
                attributeLabel={attribute}
                onChange={onAttributeChange}
                isDisabled={!userPermissions.edit.includes(attribute)}
              />
            );

          if (isOfType(attribute, 'Enum'))
            return (
              <EnumAttribute
                value={user[attribute]}
                valueOptions={enumOptions[attribute]}
                attributeLabel={attribute}
                onChange={onAttributeChange}
                isDisabled={!userPermissions.edit.includes(attribute)}
              />
            );

          if (isOfType(attribute, 'Boolean'))
            return (
              <BooleanAttribute
                value={user[attribute]}
                attributeLabel={attribute}
                onChange={onAttributeChange}
                isDisabled={!userPermissions.edit.includes(attribute)}
              />
            );

          if (isOfType(attribute, 'Date'))
            return (
              <DateAttribute
                value={Date.parse(user[attribute])}
                attributeLabel={attribute}
                onChange={onAttributeChange}
                isDisabled={!userPermissions.edit.includes(attribute)}
              />
            );

          return (
            <StringAttribute
              type="text"
              value={user[attribute]}
              attributeLabel={attribute}
              onChange={onAttributeChange}
              isDisabled={!userPermissions.edit.includes(attribute)}
            />
          );
        })
      )}
    </div>
  );
};

export default Member;
