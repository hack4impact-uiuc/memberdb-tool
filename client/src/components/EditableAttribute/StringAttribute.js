import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@hack4impact-uiuc/bridge';

const StringAttribute = ({
  type = 'text',
  value = '',
  attributeLabel = '',
  isDisabled = false,
  style = {},
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
        style={style}
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
  style: PropTypes.object,
  onChange: PropTypes.func.isRequired,
};

export default StringAttribute;
