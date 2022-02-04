// @flow
import React, { ReactElement } from 'react';
import { startCase } from 'lodash';
import { Form } from 'semantic-ui-react';

type TextAttributeProp = {
  value: string | number,
  type: string,
  attributeLabel: string,
  isDisabled: boolean,
  isRequired: boolean,
  className: string,
  onChange: Function,
};

const TextAttribute = ({
  type = 'text',
  value = '',
  attributeLabel = '',
  isDisabled = false,
  className = '',
  onChange,
  isRequired = false,
}: TextAttributeProp): ReactElement => {
  const onValueChange = (e: any) => {
    onChange(e.target.value, attributeLabel);
  };

  return (
    <div className={className}>
      <p>{startCase(attributeLabel)}</p>
      <Form.Input
        type={type}
        value={value}
        onChange={onValueChange}
        disabled={isDisabled}
        required={isRequired}
      />
    </div>
  );
};

export default TextAttribute;
