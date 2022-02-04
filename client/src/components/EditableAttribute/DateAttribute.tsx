// @flow
import React, { ReactElement } from 'react';
import DatePicker from 'react-datepicker';
import { startCase } from 'lodash';
import 'react-datepicker/dist/react-datepicker.css';
import '../../css/DateAttribute.css';

type DateAttributeProps = {
  value: Date,
  attributeLabel: string,
  isDisabled: boolean,
  className: string,
  onChange: Function,
  isRequired: boolean,
};

const DateAttribute = ({
  value = new Date(),
  attributeLabel = '',
  isDisabled = false,
  className = '',
  onChange,
  isRequired = false,
}: DateAttributeProps): ReactElement => {
  const onValueChange = (date: any) => {
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

export default DateAttribute;
