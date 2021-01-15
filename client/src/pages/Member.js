import React, { useState, useEffect } from 'react';
import EditableAttribute from '../components/EditableAttribute/EditableAttribute';
import { getMemberByID } from '../utils/apiWrapper';

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
    
    useEffect(() => {
        async function getUser() {
            let response = await getMemberByID(memberID);
            if (response && response.data.success) {
                setUser(response.data.result);
            } else {
                alert("An error occurred while retrieving member information");
            }
        };
        getUser();
    }, []);

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
