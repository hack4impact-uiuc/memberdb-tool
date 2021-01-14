import { string } from 'prop-types';
import React, { useState, useEffect } from 'react';
import StringAttribute from '../components/EditableAttribute/StringAttribute';
import EnumAttribute from '../components/EditableAttribute/EnumAttribute';
import { getMemberByID, getMemberPermissionsByID } from '../utils/apiWrapper';

const stringAttributes = ["firstName", "lastName", "email", "phone", "netID", "UIN", "major", "github", "instagram", "snapchat"];
const enumAttributes = ["gradSemester", "classStanding", "generationSemester", "location", "role", "level", "status"];

const Member = ({memberID}) => {
    // TODO: Remove this once the table pulls real data
    memberID = "5ffcc6ed3410cba712b969af";
    const [user, setUser] = useState({});
    const [userPermissions, setUserPermissions] = useState({view:[], edit:[]});
    
    useEffect(() => {
        async function getUser() {
            let memberDataResponse = await getMemberByID(memberID);
            let memberPermissionResponse = await getMemberPermissionsByID(memberID);
            if (!isResponseSuccessful(memberDataResponse)) {
                alert("Could not get member data");
                return;
            }
            setUser(memberDataResponse.data.result);

            if (!isResponseSuccessful(memberPermissionResponse)){
                alert("Could not get member permissions");
                return;
            }
            setUserPermissions(memberPermissionResponse.data.result);
        };
        getUser();
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
                        value={user[attribute]} 
                        attributeLabel={attribute} 
                        onChange={onStringAttributeChange} 
                        isDisabled={!userPermissions.edit.includes(attribute)} />

                if (enumAttributes.includes(attribute))
                    return <EnumAttribute 
                        value={user[attribute]} 
                        valueOptions={[{value:'one', label:"one"}, {value:'two', label:"two"}]}
                        attributeLabel={attribute} 
                        onChange={onEnumAttributeChange} 
                        isDisabled={!userPermissions.edit.includes(attribute)} />
            })}
        </div>
    );
};


export default Member;
