// @flow
import React, { useState, useEffect } from 'react';
import type { Node } from 'react';
import { useHistory } from 'react-router-dom';

import Page from '../components/layout/Page';
import Table from '../components/table/Table';
import { projectColumnDefs } from '../utils/tableHelpers';
import { getProjects } from '../utils/apiWrapper';

import '../css/Home.css';

const Projects = (): Node => {
  const [projects, setProjects] = useState([]);

  const history = useHistory();

  useEffect(() => {
    const getAllProjects = async () => {
      const allProjects = await getProjects();
      if (allProjects.data) {
        setProjects(allProjects.data.result);
      }
    };
    getAllProjects();
  }, []);

  return (
    <Page title="Projects">
      <Table
        data={projects}
        columns={projectColumnDefs}
        onRowClick={(e) => history.push(`/projects/${e.data._id}`)}
      />
    </Page>
  );
};

export default Projects;
