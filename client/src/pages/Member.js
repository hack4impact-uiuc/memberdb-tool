import React, { useState, useEffect } from 'react';
import EditableAttribute from '../components/EditableAttribute/EditableAttribute';
import { getMemberByID, getMemberPermissionsByID } from '../utils/apiWrapper';

const placeholderUser = {
    firstName: "No First Name Found",
    lastName: "No Last Name Found",
    email: "No Email Found",
    phone: "No Phone Found",
    netID: "No NetID Found",
    UIN: "No UIN Found",
    major: "No Major Found",
    github: "No Github Found",
    instagram: "No Instagram Found",
    snapchat: "No Snapchat Found",
};

const Member = ({memberID}) => {
    // TODO: Remove this once the table pulls real data
    memberID = "5ffcc6ed3410cba712b969af";
    const [user, setUser] = useState(placeholderUser);
    const [userPermissions, setUserPermissions] = useState({view:{}, edit:{}});
    
    useEffect(() => {
        async function getUser() {
            let memberDataResponse = await getMemberByID(memberID);
            let memberPermissionResponse = await getMemberPermissionsByID(memberID);
            if (!isResponseSuccessful(memberDataResponse)) {
                alert("Could not get member data");
                return;
            }
            setUser(memberDataResponse.data.result);

            console.log(memberPermissionResponse)
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

    return ( 
        <div>
            <EditableAttribute value={user.firstName} attributeLabel="firstName" onChange={onStringAttributeChange} />
            <EditableAttribute value={user.lastName} attributeLabel="lastName" onChange={onStringAttributeChange} />
            <EditableAttribute value={user.email} attributeLabel="email" onChange={onStringAttributeChange} />
            <EditableAttribute value={user.phone} attributeLabel="phone" onChange={onStringAttributeChange} />
            <EditableAttribute value={user.netID} attributeLabel="netID" onChange={onStringAttributeChange} /> 
            <EditableAttribute value={user.UIN} attributeLabel="UIN" onChange={onStringAttributeChange} />
            <EditableAttribute value={user.major} attributeLabel="major" onChange={onStringAttributeChange} />
            <EditableAttribute value={user.github} attributeLabel="github" onChange={onStringAttributeChange} />
            <EditableAttribute value={user.instagram} attributeLabel="instagram" onChange={onStringAttributeChange} />
            <EditableAttribute value={user.snapchat} attributeLabel="snapchat" onChange={onStringAttributeChange} />
        </div>
    );
};


export default Member;
