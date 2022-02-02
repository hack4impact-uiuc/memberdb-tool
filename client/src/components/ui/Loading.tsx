// @flow
import React, { ReactElement } from 'react';
import { Icon } from 'semantic-ui-react';

type LoadingProp = {
  height: number,
};

function Loading({ height }: LoadingProp): ReactElement {
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

export default Loading;
