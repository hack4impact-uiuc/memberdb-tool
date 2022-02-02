// @flow
import React, { ReactElement } from 'react';
import Select from 'react-select';
import { startCase } from 'lodash';

const defaultDropdownOption = { label: '', value: '' };

type ValueObject = {
  value: any
}

type EnumAttributeProp = {
  value: string,
  valueOptions: Array<ValueObject>,
  attributeLabel: string,
  isDisabled: boolean,
  className: string,
  onChange: Function,
};

const EnumAttribute = ({
  value = defaultDropdownOption.value,
  valueOptions = [],
  attributeLabel = '',
  isDisabled = false,
  className = '',
  onChange,
}: EnumAttributeProp): ReactElement => {
  const onValueChange = (selectedOption: any) => {
    onChange(selectedOption.value, attributeLabel);
  };

  const getOptionFromValue = (val: any) => {
    const dropdownOption = valueOptions.find((option) => option.value === val);
    if (dropdownOption) return dropdownOption;
    return defaultDropdownOption;
  };

  return (
    <div className={className}>
      <p>{startCase(attributeLabel)}</p>
      <Select
        value={getOptionFromValue(value)}
        isDisabled={isDisabled}
        name={attributeLabel}
        options={valueOptions}
        onChange={onValueChange}
      />
    </div>
  );
};

export default EnumAttribute;
