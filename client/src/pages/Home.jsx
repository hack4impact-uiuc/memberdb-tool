// @flow
import React, { useState, useEffect } from 'react';
import type { Node } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Modal,
  Button,
  Table as TableSem,
  Label,
  Icon,
} from 'semantic-ui-react';
import CSVReader from 'react-csv-reader';

import Page from '../components/layout/Page';
import Table from '../components/table/Table';
import { memberColumnDefs } from '../utils/tableHelpers';
import { getMembers } from '../utils/apiWrapper';

import '../css/Home.css';

const Home = (): Node => {
  const [members, setMembers] = useState([]);
  const [file, setFile] = useState({});
  const [tableData, setTableData] = useState([]);

  const history = useHistory();

  useEffect(() => {
    const getAllMembers = async () => {
      const allMembers = await getMembers();
      if (allMembers.data) {
        const membersWithLinks = allMembers.data.result.map((member) => {
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
      <Modal
        trigger={
          <div style={{ display: 'flex', justifyContent: 'right' }}>
            <Button content="ADD MEMBER" primary />
          </div>
        }
        header="Column Mapping"
        actions={[
          { key: 'cancel', content: 'CANCEL', basic: true, style: { boxShadow: "none" }},
          { key: 'submit', content: 'SUBMIT', color: 'blue' },
        ]}
        size="tiny"
        content={
          <div style={{ padding: '30px' }}>
            <div style={{ display: 'flex' }}>
              <Label
                basic
                icon="paperclip"
                style={{ width: '100%' }}
                size="big"
                content={file && file.name}
              />
              <label>
                <Label size="large" basic style={{ display: "grid", cursor: "pointer" }}>
                  <Icon name="upload" style={{ marginLeft: "10px" }}/>
                  <br />
                  Upload
                </Label>
                <CSVReader
                  inputId="CSVReader"
                  inputStyle={{ display: 'none' }}
                  onFileLoaded={(data, fileInfo) => {
                    setFile(fileInfo);
                    setTableData(data);
                  }}
                />
              </label>
            </div>
            <TableSem celled headerRow={['FILE COLUMN', 'COLUMN MAPPED TO']} />
          </div>
        }
      />
      <Table
        data={members}
        columns={memberColumnDefs}
        onRowClick={(e) => history.push(`/member/${e.data._id}`)}
      />
    </Page>
  );
};

export default Home;
