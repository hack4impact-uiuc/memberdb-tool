import React, { useState } from 'react';
import { TextField } from '@hack4impact-uiuc/bridge';

const StringAttribute = ({value, attributeLabel, isDisabled, onChange}) => {

    const onValueChange = (e) => {
        onChange(e, attributeLabel)
    }

    return (
        <div>
            <p>{attributeLabel}</p>
            <TextField placeholder={value} onChange={onValueChange} disabled={isDisabled} />
        </div>
    )
}

export default StringAttribute;