// @flow
import React, { useState, useEffect } from 'react';
import type { Node } from 'react';
import { useHistory } from 'react-router-dom';

import Page from '../components/layout/Page';
import Table from '../components/table/Table';
import { projectColumnDefs } from '../utils/tableHelpers';
import { getProjects, getMembers, getUserAuth } from '../utils/apiWrapper';
import { chapterOptions, possibleStatuses } from '../utils/consts';

import '../css/Home.css';
import { Sidebar, Segment, Form, Dimmer } from 'semantic-ui-react';

const Projects = (): Node => {
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [visible, setVisible] = useState(false);
  const [currProj, setCurrProj] = useState({});

  const history = useHistory();

  useEffect(() => {
    const getAllProjects = async () => {
      const allProjects = await getProjects();
      if (allProjects.data) {
        setProjects(allProjects.data.result);
      }
    };
    getAllProjects();
    const getAllMembers = async () => {
      const allMembers = await getMembers();
      if (allMembers.data) {
        const memberList = [];
        allMembers.data.result.forEach((e) =>
          memberList.push({
            key: e.firstName + e.lastName,
            value: e.firstName + e.lastName,
            text: `${e.firstName} ${e.lastName}`,
          }),
        );
        setMembers(memberList);
      }
    };
    const getCurrMember = async () => {
      const member = await getUserAuth();
      if (member.data) {
        console.log(member.data.result);
      }
    };
    getAllProjects();
    getAllMembers();
    getCurrMember();
  }, []);

  return (
    <Sidebar.Pushable as={Segment} style={{ height: '100vh' }}>
      <Sidebar
        as="form"
        animation="overlay"
        onHide={() => setVisible(false)}
        visible={visible}
        width="wide"
        direction="right"
      >
        <Form.Input
          label="Project Name"
          value={currProj.projectName}
          onChange={(e, { value }) =>
            setCurrProj({ ...currProj, projectName: value })
          }
        />
        <Form.Dropdown
          label="Chapter"
          search
          fluid
          selection
          options={chapterOptions}
          value={currProj.chapter}
          onChange={(e, { value }) =>
            setCurrProj({ ...currProj, chapter: value })
          }
        />
        <Form.TextArea
          label="Description"
          placeholder="Write project description here"
          defaultValue={currProj.description}
        />
        <Form.Dropdown
          label="Status"
          search
          fluid
          selection
          options={possibleStatuses}
          value={currProj.status}
          onChange={(e, { value }) =>
            setCurrProj({ ...currProj, status: value })
          }
        />
        <Form.Input label="Years in Development" value={currProj.years} />
        <Form.Dropdown
          label="Team Members"
          multiple
          fluid
          selection
          options={members}
          // value={currProj.members}
          onChange={(e, { value }) => {
            setCurrProj({ ...currProj, members: value });
          }}
        />
        <Form.Input label="Github (Optional)" value={currProj.github} />
        <Form.Input label="Notion (Optional)" value={currProj.notion} />
      </Sidebar>

      <Sidebar.Pusher dimmed={visible}>
        <Page title="Projects">
          <Table
            data={projects}
            columns={projectColumnDefs}
            onRowClick={(e) => history.push(`/projects/${e.data._id}`)}
            onRowDoubleClick={(e) => {
              setCurrProj(e.data);
              setVisible(true);
            }}
          />
        </Page>
      </Sidebar.Pusher>
    </Sidebar.Pushable>
  );
};

export default Projects;
