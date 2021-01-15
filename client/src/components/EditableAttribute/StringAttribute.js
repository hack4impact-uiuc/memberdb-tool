import React from 'react';
import PropTypes from 'prop-types';
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

StringAttribute.propTypes = {
  type: PropTypes.string,
  value: PropTypes.string,
  attributeLabel: PropTypes.string,
  isDisabled: PropTypes.bool,
  onChange: PropTypes.func,
};

export default StringAttribute;
