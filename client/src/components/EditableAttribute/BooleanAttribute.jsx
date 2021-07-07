// @flow
import React from 'react';
import type { Node } from 'react';

import EnumAttribute from './EnumAttribute';

type BooleanAttributeProps = {
  value: string,
  attributeLabel: string,
  isDisabled: Function,
  className: string,
  onChange: Function,
};

const BooleanAttribute = ({
  value = '',
  attributeLabel = '',
  isDisabled = false,
  className = '',
  onChange,
}: BooleanAttributeProps): Node => {
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

export default BooleanAttribute;
