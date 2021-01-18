import React from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DateAttribute = ({
  value = '',
  attributeLabel = '',
  isDisabled = false,
  className = '',
  onChange,
}) => {
  const onValueChange = (date) => {
    onChange(date, attributeLabel);
  };

  return (
    <div className={className}>
      <p>{attributeLabel}</p>
      <DatePicker
        onChange={onValueChange}
        selected={value}
        disabled={isDisabled}
      />
    </div>
  );
};

DateAttribute.propTypes = {
  value: PropTypes.string,
  attributeLabel: PropTypes.string,
  isDisabled: PropTypes.bool,
  className: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default DateAttribute;
