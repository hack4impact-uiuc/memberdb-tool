import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';

const defaultDropdownOption = { label: '', value: '' };

const EnumAttribute = ({
  value = defaultDropdownOption.value,
  valueOptions = [],
  attributeLabel = '',
  isDisabled = false,
  onChange,
}) => {
  const onValueChange = (selectedOption) => {
    onChange(selectedOption.value, attributeLabel);
  };

  const getOptionFromValue = (val) => {
    const dropdownOption = valueOptions.find((option) => option.value === val);
    if (dropdownOption) return dropdownOption;
    return defaultDropdownOption;
  };

  return (
    <div>
      <p>{attributeLabel}</p>
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

EnumAttribute.propTypes = {
  value: PropTypes.string,
  valueOptions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    }),
  ),
  attributeLabel: PropTypes.string,
  isDisabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
};

export default EnumAttribute;
