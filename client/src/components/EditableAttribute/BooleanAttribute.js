import React, { useState } from 'react';
import Select from 'react-select';
import EnumAttribute from './EnumAttribute';

const BooleanAttribute = ({ value, attributeLabel, isDisabled, onChange }) => {
  const valueOptions = [
    { label: 'Yes', value: 'true' },
    { label: 'No', value: 'false' },
  ];

  return (
    <EnumAttribute
      value={value}
      attributeLabel={attributeLabel}
      valueOptions={valueOptions}
      isDisabled={isDisabled}
      onChange={onChange}
    />
  );
};

export default BooleanAttribute;
