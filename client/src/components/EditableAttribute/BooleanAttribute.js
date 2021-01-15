import React from 'react';
import PropTypes from 'prop-types';
import EnumAttribute from './EnumAttribute';

const BooleanAttribute = ({
  value = '',
  attributeLabel = '',
  isDisabled = false,
  onChange,
}) => {
  const VALUE_OPTIONS = [
    { label: 'Yes', value: 'true' },
    { label: 'No', value: 'false' },
  ];

  return (
    <EnumAttribute
      value={value}
      attributeLabel={attributeLabel}
      valueOptions={VALUE_OPTIONS}
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

export default BooleanAttribute;
