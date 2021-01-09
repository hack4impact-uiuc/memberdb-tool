// @flow
import React from 'react';

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
    <>
      <h1>MERN Template</h1>
      <p>
        Below will tell you if the API is running.
        <br />
        {text}
      </p>
    </>
  );
};

export default Home;
