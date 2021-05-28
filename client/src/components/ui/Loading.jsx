// @flow
import React from 'react';
import type { Node } from 'react';
import { Icon } from 'semantic-ui-react';

type LoadingProp = {
  height: number,
};

function Loading({ height }: LoadingProp): Node {
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
