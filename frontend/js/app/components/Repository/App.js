import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import actions from '../../../redux/actions';
import Header from '../Common/Header';

import AddRepo from './AddRepo';
import CommitList from './CommitList';

const App = ({
  createRepo,
  getCommits,
  commits,
  repository,
  error,
  success,
  alertMsg,
  loading,
  loadingCommits,
  hasRepos,
  checkRepos,
}) => {
  const [text, setText] = useState('');
  const submitForm = (e) => {
    e.preventDefault();
    createRepo(text);
  };

  useEffect(() => {
    checkRepos();
    getCommits();
  }, []);

  useEffect(() => {
    checkRepos();
    getCommits();
  }, [repository]);

  return (
    <div>
      <Header />
      <AddRepo
        alertMsg={alertMsg}
        error={error}
        placeholder="<username>/<repo_name> ↵"
        setText={setText}
        submitForm={submitForm}
        success={success}
        text={text}
        title="Add a new repository"
      />
      {loading ? (
        <div className="centered fit-width">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : hasRepos ? (
        <CommitList commits={commits} detail={false} loading={loadingCommits} />
      ) : (
        <div className="search-container d-flex justify-content-center">
          <h4 className="title">Add your first repository</h4>
        </div>
      )}
    </div>
  );
};

App.propTypes = {
  createRepo: PropTypes.func,
  commits: PropTypes.array,
  getCommits: PropTypes.func,
  repository: PropTypes.object,
  error: PropTypes.object,
  success: PropTypes.object,
  alertMsg: PropTypes.object,
  loading: PropTypes.bool,
  loadingCommits: PropTypes.bool,
  hasRepos: PropTypes.bool,
  checkRepos: PropTypes.func,
};

const mapStateToProps = (state) => {
  return {
    error: state.repo.error,
    alertMsg: state.repo.alertMsg,
    loading: state.repo.loading,
    repository: state.repo.repository,
    success: state.repo.success,
    hasRepos: state.repo.hasRepos,
    commits: state.commit.commits,
    loadingCommits: state.commit.loading,
  };
};

export default connect(mapStateToProps, actions)(App);
