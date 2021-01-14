import React, { useState } from 'react';
import Select from 'react-select';

const EnumAttribute = ({
  value,
  valueOptions,
  attributeLabel,
  isDisabled,
  onChange,
}) => {
  const onValueChange = option => {
    onChange(option, attributeLabel);
  };

  return (
    <div>
      <p>{attributeLabel}</p>
      <Select
        defaultValue={value}
        value={value}
        placeholder={value}
        isDisabled={isDisabled}
        name={attributeLabel}
        options={valueOptions}
        onChange={onValueChange}
      />
    </div>
  );
};

export default EnumAttribute;
