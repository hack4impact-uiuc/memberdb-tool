// @flow
import React, { useState, useEffect, ReactElement } from 'react';
import { useHistory } from 'react-router-dom';

import Page from '../components/layout/Page';
import Table from '../components/table/Table';
import { memberColumnDefs } from '../utils/tableHelpers';
import { getMembers } from '../utils/apiWrapper';

import '../css/Home.css';

const Home = (): ReactElement => {
  const [members, setMembers] = useState([]);

  const history = useHistory();

  useEffect(() => {
    const getAllMembers = async () => {
      const allMembers = await getMembers();
      if (allMembers.data) {
        const membersWithLinks = allMembers.data.result.map((member: any) => {
          const memberCopy = { ...member };
          memberCopy.links = {
            github: member.github,
            linkedin: member.linkedin,
          };
          return memberCopy;
        });
        setMembers(membersWithLinks);
      }
    };
    getAllMembers();
  }, []);

  return (
    <Page title="Members">
      <Table
        data={members}
        columns={memberColumnDefs}
        onRowClick={(e: any) => history.push(`/member/${e.data._id}`)}
      />
    </Page>
  );
};

export default Home;