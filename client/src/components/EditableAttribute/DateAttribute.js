import React from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DateAttribute = ({
  value = '',
  attributeLabel = '',
  isDisabled = false,
  style = {},
  onChange,
}) => {
  const onValueChange = (date) => {
    onChange(date, attributeLabel);
  };

  return (
    <div>
      <p>{attributeLabel}</p>
      <DatePicker
        onChange={onValueChange}
        selected={value}
        disabled={isDisabled}
        style={style}
      />
    </div>
  );
};

DateAttribute.propTypes = {
  value: PropTypes.string,
  attributeLabel: PropTypes.string,
  isDisabled: PropTypes.bool,
  style: PropTypes.object,
  onChange: PropTypes.func.isRequired,
};

export default DateAttribute;
