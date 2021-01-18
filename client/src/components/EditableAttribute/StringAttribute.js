import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@hack4impact-uiuc/bridge';

const StringAttribute = ({
  type = 'text',
  value = '',
  attributeLabel = '',
  isDisabled = false,
  className = '',
  onChange,
}) => {
  const onValueChange = (e) => {
    onChange(e.target.value, attributeLabel);
  };

  return (
    <div className={className}>
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
  type: PropTypes.string,
  value: PropTypes.string,
  attributeLabel: PropTypes.string,
  isDisabled: PropTypes.bool,
  className: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default StringAttribute;
