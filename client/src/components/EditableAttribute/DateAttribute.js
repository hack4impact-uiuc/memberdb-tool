import React from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import { startCase } from 'lodash';
import 'react-datepicker/dist/react-datepicker.css';
import '../../css/DateAttribute.css';

const DateAttribute = ({
  value = 0,
  attributeLabel = '',
  isDisabled = false,
  className = '',
  onChange,
  isRequired = false,
}) => {
  const onValueChange = (date) => {
    onChange(date, attributeLabel);
  };

  return (
    <div className={className}>
      <p>{startCase(attributeLabel)}</p>
      <DatePicker
        className="datePicker"
        onChange={onValueChange}
        selected={value}
        disabled={isDisabled}
        required={isRequired}
      />
    </div>
  );
};

DateAttribute.propTypes = {
  value: PropTypes.number,
  attributeLabel: PropTypes.string,
  isDisabled: PropTypes.bool,
  className: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  isRequired: PropTypes.bool,
};

export default DateAttribute;
