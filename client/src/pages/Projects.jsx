// @flow
import React, { useState, useEffect } from 'react';
import type { Node } from 'react';
import { useHistory } from 'react-router-dom';

import { isEqual } from 'lodash';

import Page from '../components/layout/Page';
import Table from '../components/table/Table';
import { projectColumnDefs } from '../utils/tableHelpers';
import {
  getProjects,
  getMembers,
  getUserAuth,
  updateProject,
} from '../utils/apiWrapper';
import { chapterOptions, possibleStatuses } from '../utils/consts';

import '../css/Home.css';
import '../css/Project.css';
import { Sidebar, Segment, Form, Icon, Modal } from 'semantic-ui-react';

const Projects = (): Node => {
  const [projects, setProjects] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [visible, setVisible] = useState(false);
  const [currProj, setCurrProj] = useState({ projectName: '' });
  const [unmodProj, setUnmodProj] = useState({});
  const [editable, setEditable] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [teamEmails, setTeamEmails] = useState({});

  const history = useHistory();

  useEffect(() => {
    const getAllProjects = async () => {
      const allProjects = await getProjects();
      if (allProjects.data) {
        setProjects(allProjects.data.result);
      }
    };
    const getAllMembers = async () => {
      const allMembers = await getMembers();
      if (allMembers.data) {
        const teamMemberList = [];
        let teamEmails = {};
        allMembers.data.result.forEach((e) => {
          teamEmails = { ...teamEmails, [e.email]: e.firstName + e.lastName };
          teamMemberList.push({
            key: e.firstName + e.lastName,
            value: e.firstName + e.lastName,
            text: `${e.firstName} ${e.lastName}`,
          });
        });
        setTeamMembers(teamMemberList);
        setTeamEmails(teamEmails);
      }
    };
    const getCurrMember = async () => {
      const member = await getUserAuth();
      setEditable(
        member.data &&
          (member.data.result.level === 'ADMIN' ||
            member.data.result.level === 'DIRECTOR'),
      );
    };
    getAllProjects();
    getAllMembers();
    getCurrMember();
  }, []);

  const filterObj = (raw, allowed) => {
    if (allowed) {
      const filtered = Object.keys(raw)
        .filter((key) => allowed.includes(key))
        .reduce((obj, key) => {
          obj[key] = raw[key];
          return obj;
        }, {});
      return Object.values(filtered);
    }
  };

  return (
    <Sidebar.Pushable as={Segment} style={{ height: '100vh' }}>
      <Modal
        open={showModal}
        header="You have unsaved changes"
        size="mini"
        content="Save your changes before going back?"
        actions={[
          {
            key: 'no',
            content: 'No',
            negative: true,
            onClick: () => setShowModal(false),
          },
          {
            key: 'Save',
            content: 'Save',
            positive: true,
            icon: 'check',
            labelPosition: 'right',
            onClick: () => {
              setUnmodProj(currProj);
              updateProject(currProj, currProj._id);
              setShowModal(false);
            },
          },
        ]}
      />
      <Sidebar
        as="form"
        animation="overlay"
        onHide={() => {
          setVisible(false);
          setEditMode(false);
          if (!isEqual(currProj, unmodProj)) setShowModal(true);
        }}
        visible={visible}
        width="wide"
        direction="right"
      >
        <Icon
          name="arrow left"
          onClick={() => {
            setVisible(false);
            setEditMode(false);
          }}
          style={{ cursor: 'pointer' }}
        />
        {editable && (
          <Icon
            name="edit outline"
            style={{ cursor: 'pointer' }}
            onClick={() => setEditMode(true)}
          />
        )}
        <Form.Group>
          <Form.Input
            label="Project Name"
            value={currProj.projectName}
            onChange={(e, { value }) => {
              setCurrProj({ ...currProj, projectName: value });
            }}
            readOnly={!editMode}
          />
          <Form.Dropdown
            label="Chapter"
            search
            fluid
            selection
            options={chapterOptions}
            value={currProj.chapter}
            onChange={(e, { value }) => {
              setCurrProj({ ...currProj, chapter: value });
            }}
            disabled={!editMode}
          />
          <Form.TextArea
            label="Description"
            placeholder="Write project description here"
            defaultValue={currProj.description}
            readOnly={!editMode}
            onChange={(e, { value }) => {
              setCurrProj({ ...currProj, description: value });
            }}
          />
          <Form.Dropdown
            label="Status"
            search
            fluid
            selection
            options={possibleStatuses}
            value={currProj.status}
            onChange={(e, { value }) => {
              setCurrProj({ ...currProj, status: value });
            }}
            disabled={!editMode}
          />
          <Form.Input
            label="Years in Development"
            value={
              currProj.duration
                ? `${currProj.duration.amount} ${currProj.duration.unit}`
                : {}
            }
            readOnly={!editMode}
            onChange={(e, { value }) => {
              setCurrProj({ ...currProj, duration: value });
            }}
          />
          {console.log(currProj)}
          <Form.Dropdown
            label="Team Members"
            multiple
            fluid
            selection
            options={teamMembers}
            value={
              currProj.teamMembersEmail
                ? filterObj(teamEmails, currProj.teamMembersEmail)
                : []
            }
            disabled={!editMode}
          />
          <Form.Input
            label="Github (Optional)"
            value={currProj.github}
            readOnly={!editMode}
            onChange={(e, { value }) => {
              setCurrProj({ ...currProj, github: value });
            }}
          />
          <Form.Input
            label="Notion (Optional)"
            value={currProj.notion}
            readOnly={!editMode}
            onChange={(e, { value }) => {
              setCurrProj({ ...currProj, notion: value });
            }}
          />
          <Form.Button
            type="submit"
            content="Save Changes"
            disabled={isEqual(currProj, unmodProj)}
            onClick={(e) => {
              setUnmodProj(currProj);
              updateProject(currProj, currProj._id);
              e.preventDefault();
            }}
          />
        </Form.Group>
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
              setUnmodProj(e.data);
            }}
          />
        </Page>
      </Sidebar.Pusher>
    </Sidebar.Pushable>
  );
};

export default Projects;
