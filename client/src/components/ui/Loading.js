import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';

function Loading({ height }) {
  return (
    <div
      style={{
        height: height ?? 'auto',
        display: 'grid',
        placeItems: 'center',
        fontSize: '20px',
      }}
    >
      <span>
        <Icon loading name="spinner" /> Loading...
      </span>
    </div>
  );
}

Loading.propTypes = {
  height: PropTypes.number,
};

export default Loading;
