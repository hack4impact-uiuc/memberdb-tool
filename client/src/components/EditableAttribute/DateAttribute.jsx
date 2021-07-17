// @flow
import React from 'react';
import type { Node } from 'react';
import DatePicker from 'react-datepicker';
import { startCase } from 'lodash';
import 'react-datepicker/dist/react-datepicker.css';
import '../../css/DateAttribute.css';

type DateAttributeProps = {
  value: number,
  attributeLabel: string,
  isDisabled: boolean,
  className: string,
  onChange: Function,
  isRequired: boolean,
};

const DateAttribute = ({
  value = 0,
  attributeLabel = '',
  isDisabled = false,
  className = '',
  onChange,
  isRequired = false,
}: DateAttributeProps): Node => {
  const onValueChange = (date) => {
    onChange(date, attributeLabel);
  };

  return (
    <div className={className}>
      <p>{startCase(attributeLabel).toUpperCase()}</p>
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

export default DateAttribute;
