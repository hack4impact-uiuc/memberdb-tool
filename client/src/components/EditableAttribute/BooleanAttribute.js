import React from 'react';
import PropTypes from 'prop-types';
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

BooleanAttribute.propTypes = {
  value: PropTypes.string,
  attributeLabel: PropTypes.string,
  isDisabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
};

BooleanAttribute.defaultProps = {
  value: '',
  attributeLabel: '',
  isDisabled: false,
};

export default BooleanAttribute;
