import React, { ReactElement } from 'react';
import './Label.css';

type LabelProp = {
  children: ReactElement,
  textColor: string,
  backgroundColor: string,
};

const Label = ({ children, textColor = 'black', backgroundColor = 'lightgrey' }: LabelProp) => {

  const labelStyles = {
    color: textColor,
    backgroundColor,
  };

  return (
    <div className="label-wrapper" style={labelStyles}>
      <span className="label-content">{children}</span>
    </div>
  );
};

export default Label;
