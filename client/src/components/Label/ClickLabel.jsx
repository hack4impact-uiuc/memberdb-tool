import React from 'react';
import PropTypes from 'prop-types';
import './Label.css';
import { IoCloseOutline } from 'react-icons/io5';

const ClickLabel = ({
  children,
  textColor,
  backgroundColor,
  initials,
  onClickClose,
}) => {
  const labelStyles = {
    color: textColor,
    backgroundColor,
  };

  const initialsStyles = {
    color: backgroundColor,
    backgroundColor: textColor,
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

ClickLabel.propTypes = {
  children: PropTypes.string,
  textColor: PropTypes.string,
  backgroundColor: PropTypes.string,
  initials: PropTypes.string,
  onClickClose: PropTypes.func,
};

ClickLabel.defaultProps = {
  textColor: 'black',
  backgroundColor: 'lightgrey',
};

export default ClickLabel;
