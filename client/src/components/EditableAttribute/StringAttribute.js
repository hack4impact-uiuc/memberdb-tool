import React, { useState } from 'react';
import { TextField } from '@hack4impact-uiuc/bridge';

const StringAttribute = ({value, attributeLabel, isDisabled, onChange}) => {

    const onValueChange = (e) => {
        onChange(e, attributeLabel)
    }

    return (
        <TextField placeholder={value} onChange={onValueChange} disabled={isDisabled} />
    )
}

export default StringAttribute;