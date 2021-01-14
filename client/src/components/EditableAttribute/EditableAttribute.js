import React, { useState } from 'react';
import { TextField } from '@hack4impact-uiuc/bridge';

const EditableAttribute = ({value, setValue, isEditable}) => {

    const onValueChange = (e) => {
        setValue(e.target.value);
    }

    return (
        <TextField placeholder={value} onChange={onValueChange}/>
    )
}

export default EditableAttribute;