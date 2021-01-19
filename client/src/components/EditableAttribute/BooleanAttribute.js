import React from 'react';
import PropTypes from 'prop-types';

import EnumAttribute from './EnumAttribute';

const BooleanAttribute = ({
  value = '',
  attributeLabel = '',
  isDisabled = false,
  className = '',
  onChange,
}) => {
  const VALUE_OPTIONS = [
    { label: 'Yes', value: 'true' },
    { label: 'No', value: 'false' },
  ];

  return (
    <EnumAttribute
      value={value ? value.toString() : 'false'}
      attributeLabel={attributeLabel}
      valueOptions={VALUE_OPTIONS}
      isDisabled={isDisabled}
      className={className}
      onChange={onChange}
    />
  );
};

BooleanAttribute.propTypes = {
  value: PropTypes.bool,
  attributeLabel: PropTypes.string,
  isDisabled: PropTypes.bool,
  className: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default BooleanAttribute;
