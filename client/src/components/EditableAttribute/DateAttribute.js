import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DateAttribute = ({ value, attributeLabel, isDisabled, onChange }) => {
  const onValueChange = date => {
    onChange(date, attributeLabel);
  };

  return (
    <div>
      <p>{attributeLabel}</p>
      <DatePicker
        onChange={onValueChange}
        selected={value}
        disabled={isDisabled}
      />
    </div>
  );
};

export default DateAttribute;
