import React from 'react';
import PropTypes from 'prop-types';
import { startCase } from 'lodash';
import { Form } from 'semantic-ui-react';

const TextAttribute = ({
  type = 'text',
  value = '',
  attributeLabel = '',
  isDisabled = false,
  className = '',
  onChange,
  isRequired = false,
}) => {
  const onValueChange = (e) => {
    onChange(e.target.value, attributeLabel);
  };

  return (
    <div className={className}>
      <p>{startCase(attributeLabel)}</p>
      <Form.Input
        type={type}
        value={value}
        onChange={onValueChange}
        disabled={isDisabled}
        required={isRequired}
      />
    </div>
  );
};

TextAttribute.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  type: PropTypes.string,
  attributeLabel: PropTypes.string,
  isDisabled: PropTypes.bool,
  isRequired: PropTypes.bool,
  className: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default TextAttribute;
