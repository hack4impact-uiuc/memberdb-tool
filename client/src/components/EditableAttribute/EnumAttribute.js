
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
        <Select defaultValue={value} isDisabled={isDisabled} name={attributeLabel} options={valueOptions} onChange={onValueChange}/>
    )
}

export default EnumAttribute;