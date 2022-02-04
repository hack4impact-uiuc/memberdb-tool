import React, { MouseEventHandler, ReactElement } from 'react';
import PropTypes from 'prop-types';
import './Label.css';
import { IoCloseOutline } from 'react-icons/io5';

type ClickLabelProp = {
  children: ReactElement,
  textColor: string,
  backgroundColor: string,
  initials: string,
  onClickClose: MouseEventHandler
};

const ClickLabel = ({
  children,
  textColor = 'black',
  backgroundColor = 'lightgrey',
  initials,
  onClickClose,
}: ClickLabelProp) => {
  const labelStyles = {
    color: textColor,
    backgroundColor,
  };

  const initialsStyles = {
    color: textColor,
    backgroundColor,
  };

  return (
    <div className="label-wrapper click-label-wrapper" style={labelStyles}>
      {initials && (
        <div className="initials" style={initialsStyles}>
          {initials}
        </div>
      )}
      <span className="label-content">{children}</span>
      {onClickClose && (
        <IoCloseOutline
          onClick={onClickClose}
          className="close-label"
          size="20px"
        />
      )}
    </div>
  );
};

export default ClickLabel;
