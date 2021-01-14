
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
        <Select defaultValue={value} name={attributeLabel} options={valueOptions} onChange={onValueChange}/>
    //     <Dropdown open={isOpen} onToggle={handleToggle} onClickOutside={handleClickOutside} onSelect={onValueChange} onChange={onValueChange}>
    //     <Dropdown.Summary>{attributeLabel}</Dropdown.Summary>
    //     <Dropdown.Menu>
    //         {valueOptions.map(option => <Dropdown.Item key={option} onChange={onValueChange}>{option}</Dropdown.Item>)}
    //     </Dropdown.Menu>
    // </Dropdown>
    )
}

export default EnumAttribute;