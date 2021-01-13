import React, { useState, useEffect } from 'react';

import Table from '../components/table/Table';

import { getSampleResponse } from '../utils/apiWrapper';

import '../css/Home.css';

const Home = () => {
  const [text, setText] = useState('You did not run local API!');

  useEffect(() => {
    const populateText = async () => {
      const resp = await getSampleResponse();
      if (!resp.error) setText(resp.data.result);
    };

    populateText();
  }, []);

  return (
    <div>
      <div style={{ textAlign: 'center' }}>
        <h1>API Status Below</h1>
        <p>{text}</p>
      </div>
      <Table />
    </div>
  );
};

export default Home;
