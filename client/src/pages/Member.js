import { string } from 'prop-types';
import React, { useState, useEffect } from 'react';
import StringAttribute from '../components/EditableAttribute/StringAttribute';
import EnumAttribute from '../components/EditableAttribute/EnumAttribute';
import { getMemberByID, getMemberEnumOptions, getMemberPermissionsByID } from '../utils/apiWrapper';
import BooleanAttribute from '../components/EditableAttribute/BooleanAttribute';

const stringAttributes = ["firstName", "lastName", "email", "phone", "netID", "UIN", "major", "github", "instagram", "snapchat"];
const numberAttributes = ["gradYear", "generationYear"];
const enumAttributes = ["gradSemester", "classStanding", "generationSemester", "location", "role", "level", "status"];
const booleanAttributes = ["areDuesPaid"];

const Member = ({memberID}) => {
    // TODO: Remove this once the table pulls real data
    memberID = "5ffcc6ed3410cba712b969af";
    const [user, setUser] = useState({});
    const [userPermissions, setUserPermissions] = useState({view:[], edit:[]});
    const [enumOptions, setEnumOptions] = useState({});
    
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

        async function getEnumOptions() {
            let enumOptionsResponse = await getMemberEnumOptions();
            if (!isResponseSuccessful(enumOptionsResponse)) {
                alert("Could not get enum options");
                return;
            }

            const allOptions = enumOptionsResponse.data.result;
            const newEnumOptions = {};
            for (var attributeLabel in allOptions) {
                if (!Object.prototype.hasOwnProperty.call(allOptions, attributeLabel))
                    continue

                newEnumOptions[attributeLabel] = [];
                for (var option in allOptions[attributeLabel]) {
                    if (!Object.prototype.hasOwnProperty.call(allOptions[attributeLabel], option))
                        continue

                    newEnumOptions[attributeLabel].push({
                        label: allOptions[attributeLabel][option],
                        value: allOptions[attributeLabel][option],
                    });
                }
            }

            setEnumOptions(newEnumOptions);
        };

        getUser();
        getUserPermissions();
        getEnumOptions();
    }, []);

    const isResponseSuccessful = (response) => {
        return response && response.data && response.data.success
    }

    const onStringAttributeChange = (e, attributeLabel) => {
        var userCopy = { ...user };
        userCopy[attributeLabel] = e.target.value
        setUser(userCopy);
    }

    const onEnumAttributeChange = (value, attributeLabel) => {
        var userCopy = { ...user };
        userCopy[attributeLabel] = value
        setUser(userCopy);
    }

    return ( 
        <div>
            {userPermissions.view.map(attribute => {
                if (stringAttributes.includes(attribute))
                    return <StringAttribute 
                        type="text"
                        value={user[attribute]} 
                        attributeLabel={attribute} 
                        onChange={onStringAttributeChange} 
                        isDisabled={!userPermissions.edit.includes(attribute)} />

                if (numberAttributes.includes(attribute))
                    return <StringAttribute 
                        type="number"
                        value={user[attribute]} 
                        attributeLabel={attribute} 
                        onChange={onStringAttributeChange} 
                        isDisabled={!userPermissions.edit.includes(attribute)} />

                if (enumAttributes.includes(attribute))
                    return <EnumAttribute 
                        value={user[attribute]} 
                        valueOptions={enumOptions[attribute]}
                        attributeLabel={attribute} 
                        onChange={onEnumAttributeChange} 
                        isDisabled={!userPermissions.edit.includes(attribute)} />
                
                if (booleanAttributes.includes(attribute))
                    return <BooleanAttribute 
                        value={user[attribute]} 
                        attributeLabel={attribute} 
                        onChange={onEnumAttributeChange} 
                        isDisabled={!userPermissions.edit.includes(attribute)} />
            })}
        </div>
    );
};


export default Member;
