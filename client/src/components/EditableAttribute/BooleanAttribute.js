// @flow
import React from 'react';
import EnumAttribute from './EnumAttribute';

const BooleanAttribute = ({
  value = '',
  attributeLabel = '',
  isDisabled = false,
  className = '',
  onChange,
}: BooleanAttributeProps) => {
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

type BooleanAttributeProps = {
  value: string,
  attributeLabel: string,
  isDisabled: boolean,
  className: string,
  onChange: function,
};

export default BooleanAttribute;
