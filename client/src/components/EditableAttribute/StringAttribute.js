import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@hack4impact-uiuc/bridge';

const StringAttribute = ({
  type = 'text',
  value = '',
  attributeLabel = '',
  isDisabled = false,
  onChange,
}) => {
  const onValueChange = (e) => {
    onChange(e.target.value, attributeLabel);
  };

  return (
    <div>
      <p>{attributeLabel}</p>
      <TextField
        type={type}
        value={value}
        onChange={onValueChange}
        disabled={isDisabled}
      />
    </div>
  );
};

StringAttribute.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  type: PropTypes.string,
  attributeLabel: PropTypes.string,
  isDisabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
};

export default StringAttribute;
