import React, { useState } from 'react';
import { TextField } from '@hack4impact-uiuc/bridge';

const EditableAttribute = ({value, attributeLabel, isDisabled, onChange}) => {

    const onValueChange = (e) => {
        onChange(e, attributeLabel)
    }

    return (
        <TextField placeholder={value} onChange={onValueChange} disabled={isDisabled} />
    )
}

export default EditableAttribute;