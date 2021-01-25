import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@hack4impact-uiuc/bridge';

const TextAttribute = ({
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

TextAttribute.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  type: PropTypes.string,
  attributeLabel: PropTypes.string,
  isDisabled: PropTypes.bool,
  className: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default TextAttribute;
