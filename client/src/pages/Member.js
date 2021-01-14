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
        async function getUserData() {
            let memberDataResponse = await getMemberByID(memberID);
            let memberPermissionResponse = await getMemberPermissionsByID(memberID);
            let memberSchemaResponse = await getMemberSchemaTypes();
            let enumOptionsResponse = await getMemberEnumOptions();

            if (!areResponsesSuccessful(memberDataResponse, memberPermissionResponse, memberSchemaResponse, enumOptionsResponse)) {
                alert("An error occurred");
                return;
            }

            setUser(memberDataResponse.data.result);
            setUserPermissions(memberPermissionResponse.data.result);
            setSchemaTypes(memberSchemaResponse.data.result)
            setEnumOptions(enumOptionsResponse.data.result);
        };

        getUserData();
    }, []);

    
    // Returns true if the member attribute is of the given type.
    // Type is a string defined by mongoose. See https://mongoosejs.com/docs/schematypes.html
    const isOfType = (attribute, type) => {
        if (!schemaTypes || !type || !schemaTypes[type])
        return false;
        
        return schemaTypes[type].includes(attribute);
    };

    const areResponsesSuccessful  = (...responses) => {
        responses.forEach(response => {
          if (response == null || response.data == null || !response.data.success)  
            return false
        });

        return true;
    };

    const onAttributeChange = (e, attributeLabel) => {
        var userCopy = { ...user };
        userCopy[attributeLabel] = e.target.value
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
                        onChange={onAttributeChange} 
                        isDisabled={!userPermissions.edit.includes(attribute)} />

                if (isOfType(attribute, "Number"))
                    return <StringAttribute 
                        type="number"
                        value={user[attribute]} 
                        attributeLabel={attribute} 
                        onChange={onAttributeChange} 
                        isDisabled={!userPermissions.edit.includes(attribute)} />

                if (isOfType(attribute, "Enum"))
                    return <EnumAttribute 
                        value={user[attribute]} 
                        valueOptions={enumOptions[attribute]}
                        attributeLabel={attribute} 
                        onChange={onAttributeChange} 
                        isDisabled={!userPermissions.edit.includes(attribute)} />
                
                if (isOfType(attribute, "Boolean"))
                    return <BooleanAttribute 
                        value={user[attribute]} 
                        attributeLabel={attribute} 
                        onChange={onAttributeChange} 
                        isDisabled={!userPermissions.edit.includes(attribute)} />

                if (isOfType(attribute, "Date"))
                    return <DateAttribute 
                        value={Date.parse(user[attribute])} 
                        attributeLabel={attribute} 
                        onChange={onAttributeChange} 
                        isDisabled={!userPermissions.edit.includes(attribute)} />
            })}
        </div>
    );
};


export default Member;
