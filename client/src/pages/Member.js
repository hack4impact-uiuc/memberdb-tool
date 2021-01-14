import React, { useState } from 'react';
import EditableAttribute from '../components/EditableAttribute/EditableAttribute';

const Member = ({memberID}) => {
    // TODO: Remove this once the table pulls real data
    memberID = "5ffcc6ed3410cba712b969af";

    const [firstName, setFirstName] = useState("No First Name Found");
    const [lastName, setLastName] = useState("No Last Name Found");
    const [email, setEmail] = useState("No Email Found");
    const [phone, setPhone] = useState("No Phone Found");
    const [netID, setNetID] = useState("No NetID Found");
    const [UIN, setUIN] = useState("No UIN Found");
    const [major, setMajor] = useState("No Major Found");
    const [github, setGithub] = useState("No Github Found");
    const [instagram, setInstagram] = useState("No Instagram Found");
    const [snapchat, setSnapchat] = useState("No Snapchat Found");
    // TODO: Birthdate

    return ( 
        <div>
            <EditableAttribute value={firstName} setValue={setFirstName}/>
            <EditableAttribute value={lastName} setValue={setLastName}/>
            <EditableAttribute value={email} setValue={setEmail}/>
            <EditableAttribute value={phone} setValue={setPhone}/>
            <EditableAttribute value={netID} setValue={setNetID}/>
            <EditableAttribute value={UIN} setValue={setUIN}/>
            <EditableAttribute value={major} setValue={setMajor}/>
            <EditableAttribute value={github} setValue={setGithub}/>
            <EditableAttribute value={instagram} setValue={setInstagram}/>
            <EditableAttribute value={snapchat} setValue={setSnapchat}/>
        </div>
    );
};


export default Member;
