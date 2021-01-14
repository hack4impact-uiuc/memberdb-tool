
import React, { useState } from 'react';
import { Dropdown } from '@hack4impact-uiuc/bridge';
import Select from 'react-select';

const EnumAttribute = ({value, valueOptions, attributeLabel, isDisabled, onChange}) => {

    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = (e) => {setIsOpen(e.target.open); console.log(e)}
    const handleClickOutside = () => setIsOpen(false)

    const onValueChange = (option) => {
        onChange(option, attributeLabel)
    }

    return (
        <div>
            <p>{attributeLabel}</p>
            <Select defaultValue={value} value={value} placeholder={value} isDisabled={isDisabled} name={attributeLabel} options={valueOptions} onChange={onValueChange}/>
        </div>
    )
}

export default EnumAttribute;