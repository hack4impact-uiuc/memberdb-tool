import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';

const EnumAttribute = ({
  value = '',
  valueOptions = [],
  attributeLabel = '',
  isDisabled = false,
  onChange,
}) => {
  const onValueChange = (option) => {
    onChange(option, attributeLabel);
  };

  const getOptionFromValue = (val) => valueOptions.find((option) => option.val === val);

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
  value: PropTypes.shape({ label: PropTypes.string, value: PropTypes.string }),
  valueOptions: PropTypes.arrayOf(PropTypes.string),
  attributeLabel: PropTypes.string,
  isDisabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
};

export default EnumAttribute;
