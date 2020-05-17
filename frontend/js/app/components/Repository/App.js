import React, { useState } from 'react';

import Header from '../Common/Header';

import AddRepo from './AddRepo';
import CommitList from './CommitList';

const App = () => {
  const [text, setText] = useState('');
  const noRepos = false;
  const submitForm = (e) => {
    e.preventDefault();
  };
  const commits = [
    {
      id: 1234,
      author: 'Alesson Delmiro',
      commit: '5632553',
      message:
        'Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum',
      date: 'Nov 29, 2020',
      repository: {
        id: 123,
        name: 'github_monitor',
      },
    },
  ];

  return (
    <div>
      <Header />
      <AddRepo
        // error="BLA BLE"
        placeholder="<username>/<repo_name>"
        setText={setText}
        submitForm={submitForm}
        // success="BLA BLE"
        text={text}
        title="Add a new repository"
      />
      {noRepos ? (
        <div className="search-container d-flex justify-content-center">
          <h4 className="title">Add your first repository</h4>
        </div>
      ) : (
        <CommitList commits={commits} detail={false} />
      )}
    </div>
  );
};

export default App;
