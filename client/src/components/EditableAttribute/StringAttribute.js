import React from 'react';
import { TextField } from '@hack4impact-uiuc/bridge';

const StringAttribute = ({
  type,
  value,
  attributeLabel,
  isDisabled,
  onChange,
}) => {
  const onValueChange = e => {
    onChange(e.target.value, attributeLabel);
  };

  return (
    <div>
      <p>{attributeLabel}</p>
      <TextField
        type={type}
        placeholder={value}
        onChange={onValueChange}
        disabled={isDisabled}
      />
    </div>
  );
};

export default StringAttribute;
