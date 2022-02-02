// @flow
import React, { useState, useEffect, ReactElement } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Button, Icon } from 'semantic-ui-react';
import 'draft-js/dist/Draft.css';

import { getNotes } from '../utils/apiWrapper';
import { notesColumnDefs } from '../utils/tableHelpers';
import Loading from '../components/ui/Loading';
import Page from '../components/layout/Page';
import Table from '../components/table/Table';

const Notes = (): ReactElement => {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const history = useHistory();

  useEffect(() => {
    async function getNoteData() {
      const {
        data: { result },
      } = await getNotes();

      setNotes(result ?? []);

      setIsLoading(false);
    }
    getNoteData();
  }, []);

  if (isLoading) {
    return <Loading height={600} />;
  }

  return (
    <Page
      title="Notes"
      menuItems={
        <Link to="/notes/new">
          <Button primary>
            <Icon name="plus" /> New Note
          </Button>
        </Link>
      }
    >
      {notes.length ? (
        <Table
          data={notes}
          columns={notesColumnDefs}
          onRowClick={(e) => history.push(`/notes/${e.data._id}`)}
          sizeToFit
        />
      ) : (
        'No notes here!'
      )}
    </Page>
  );
}

export default Notes;
