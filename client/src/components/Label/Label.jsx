import React from 'react';
import PropTypes from 'prop-types';
import './Label.css';

const Label = ({ children, textColor, backgroundColor }) => {
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

Label.propTypes = {
  children: PropTypes.string,
  textColor: PropTypes.string,
  backgroundColor: PropTypes.string,
};

Label.defaultProps = {
  children: '',
  textColor: 'black',
  backgroundColor: 'lightgrey',
};

export default Label;
