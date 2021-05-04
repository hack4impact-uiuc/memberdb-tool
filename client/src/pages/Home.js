import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import Page from '../components/layout/Page';
import Table from '../components/table/Table';
import { memberColumnDefs } from '../utils/tableHelpers';
import { getMembers } from '../utils/apiWrapper';

import '../css/Home.css';

const Home = () => {
  const [members, setMembers] = useState([]);

  const history = useHistory();

  useEffect(() => {
    const getAllMembers = async () => {
      const allMembers = await getMembers();
      if (allMembers.data) {
        setMembers(allMembers.data.result);
      }
    };
    getAllMembers();
  }, []);

  return (
    <Page title="Members">
      <Table
        data={members}
        columns={memberColumnDefs}
        onRowClick={(e) => history.push(`/member/${e.data._id}`)}
      />
    </Page>
  );
};

export default Home;
