import { string } from 'prop-types';
import React, { useState, useEffect } from 'react';
import StringAttribute from '../components/EditableAttribute/StringAttribute';
import EnumAttribute from '../components/EditableAttribute/EnumAttribute';
import { getMemberByID, getMemberEnumOptions, getMemberPermissionsByID, getMemberSchemaTypes } from '../utils/apiWrapper';
import BooleanAttribute from '../components/EditableAttribute/BooleanAttribute';
import DateAttribute from '../components/EditableAttribute/DateAttribute';

const Member = ({memberID}) => {
    // TODO: Remove this once the table pulls real data
    memberID = "5ffcc6ed3410cba712b969af";

    const [user, setUser] = useState({});
    const [userPermissions, setUserPermissions] = useState({view:[], edit:[]});
    const [enumOptions, setEnumOptions] = useState({});
    const [schemaTypes, setSchemaTypes] = useState({})
    
    useEffect(() => {
        async function getUser() {
            let memberDataResponse = await getMemberByID(memberID);
            if (!isResponseSuccessful(memberDataResponse)) {
                alert("Could not get member data");
                return;
            }
            setUser(memberDataResponse.data.result);
        };

        async function getUserPermissions() {
            let memberPermissionResponse = await getMemberPermissionsByID(memberID);
            if (!isResponseSuccessful(memberPermissionResponse)){
                alert("Could not get member permissions");
                return;
            }
            setUserPermissions(memberPermissionResponse.data.result);
        };

        async function getSchemaTypes() {
            let memberSchemaResponse = await getMemberSchemaTypes();
            if (!isResponseSuccessful(memberSchemaResponse)){
                alert("Could not get member schema types");
                return;
            }
            setSchemaTypes(memberSchemaResponse.data.result)
        }

        async function getEnumOptions() {
            let enumOptionsResponse = await getMemberEnumOptions();
            if (!isResponseSuccessful(enumOptionsResponse)) {
                alert("Could not get enum options");
                return;
            }

            console.log(enumOptionsResponse)
            setEnumOptions(enumOptionsResponse.data.result);
        };

        getUser();
        getUserPermissions();
        getSchemaTypes();
        getEnumOptions();
    }, []);

    
    // Returns true if the member attribute is of the given type.
    // Type is a string defined by mongoose. See https://mongoosejs.com/docs/schematypes.html
    const isOfType = (attribute, type) => {
        if (!schemaTypes || !type || !schemaTypes[type])
        return false;
        
        return schemaTypes[type].includes(attribute);
    };

    const isResponseSuccessful = (response) => {
        return response && response.data && response.data.success
    };

    const onStringAttributeChange = (e, attributeLabel) => {
        var userCopy = { ...user };
        userCopy[attributeLabel] = e.target.value
        setUser(userCopy);
    };

    const onEnumAttributeChange = (value, attributeLabel) => {
        var userCopy = { ...user };
        userCopy[attributeLabel] = value
        setUser(userCopy);
    };

    return ( 
        <div>
            {userPermissions.view.map(attribute => {
                if (isOfType(attribute, "String"))
                    return <StringAttribute 
                        type="text"
                        value={user[attribute]} 
                        attributeLabel={attribute} 
                        onChange={onStringAttributeChange} 
                        isDisabled={!userPermissions.edit.includes(attribute)} />

                if (isOfType(attribute, "Number"))
                    return <StringAttribute 
                        type="number"
                        value={user[attribute]} 
                        attributeLabel={attribute} 
                        onChange={onStringAttributeChange} 
                        isDisabled={!userPermissions.edit.includes(attribute)} />

                if (isOfType(attribute, "Enum"))
                    return <EnumAttribute 
                        value={user[attribute]} 
                        valueOptions={enumOptions[attribute]}
                        attributeLabel={attribute} 
                        onChange={onEnumAttributeChange} 
                        isDisabled={!userPermissions.edit.includes(attribute)} />
                
                if (isOfType(attribute, "Boolean"))
                    return <BooleanAttribute 
                        value={user[attribute]} 
                        attributeLabel={attribute} 
                        onChange={onEnumAttributeChange} 
                        isDisabled={!userPermissions.edit.includes(attribute)} />

                if (isOfType(attribute, "Date"))
                    return <DateAttribute 
                        value={Date.parse(user[attribute])} 
                        attributeLabel={attribute} 
                        onChange={onEnumAttributeChange} 
                        isDisabled={!userPermissions.edit.includes(attribute)} />
            })}
        </div>
    );
};


export default Member;
