import React, { useState } from 'react';
import { TextField } from '@hack4impact-uiuc/bridge';

const EditableAttribute = ({value, attributeLabel, isEditable, onChange}) => {

    const onValueChange = (e) => {
        onChange(e, attributeLabel)
    }

    return (
        <TextField placeholder={value} onChange={onValueChange}/>
    )
}

export default EditableAttribute;