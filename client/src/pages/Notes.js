import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'draft-js/dist/Draft.css';

import { getNotes } from '../utils/apiWrapper';

function Notes() {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const {
        data: { result },
      } = await getNotes();
      setNotes(result ?? []);
      setIsLoading(false);
    })();
  }, []);

  if (isLoading) {
    return <>Loading...</>;
  }

  return (
    <div className="note-wrapper">
      {notes.length ? (
        <>
          {notes.map((note) => {
            const {
              _id,
              metaData: { title, labels },
            } = note;
            return (
              <li key={_id}>
                <Link to={`/notes/${_id}`}>
                  {title}, {labels}
                </Link>
              </li>
            );
          })}
        </>
      ) : (
        <>
          No notes here! <Link to="/note/new">Create one!</Link>
        </>
      )}
    </div>
  );
}
export default Notes;
