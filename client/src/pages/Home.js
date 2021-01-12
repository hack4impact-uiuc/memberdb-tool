// @flow
import React from 'react';

import Table from '../components/table/Table';

import { getSampleResponse } from '../utils/apiWrapper';

import '../css/Home.css';

const Home = () => {
  const [text, setText] = React.useState('You did not run local API!');

  React.useEffect(() => {
    const populateText = async () => {
      const resp = await getSampleResponse();
      if (!resp.error) setText(resp.data.result);
    };

    populateText();
  }, []);

  return (
    <div>
      <Table />
    </div>
  );
};

export default Home;
