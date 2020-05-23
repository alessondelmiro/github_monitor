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
  hasNext,
  newRepo,
  error,
  success,
  alertMsg,
  loading,
  loadingCommits,
  hasRepos,
  checkRepos,
  user,
}) => {
  let page = 1;
  const [text, setText] = useState('');
  const submitForm = (e) => {
    e.preventDefault();
    createRepo(text);
  };

  const showMore = () => {
    if (hasNext) {
      page += 1;
      getCommits(page);
    }
  };

  useEffect(() => {
    checkRepos();
    getCommits(page);
  }, []);

  useEffect(() => {
    if (newRepo) {
      checkRepos();
      getCommits(1);
    }
  }, [newRepo]);

  return (
    <div>
      <Header user={user} />
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
        <CommitList
          commits={commits}
          detail={false}
          hasNext={hasNext}
          loading={loadingCommits}
          showMore={showMore}
        />
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
  hasNext: PropTypes.bool,
  getCommits: PropTypes.func,
  newRepo: PropTypes.bool,
  error: PropTypes.object,
  success: PropTypes.object,
  alertMsg: PropTypes.object,
  loading: PropTypes.bool,
  loadingCommits: PropTypes.bool,
  hasRepos: PropTypes.bool,
  checkRepos: PropTypes.func,
  user: PropTypes.object,
};

const mapStateToProps = (state) => {
  return {
    error: state.repo.error,
    alertMsg: state.repo.alertMsg,
    loading: state.repo.loading,
    newRepo: state.repo.newRepo,
    success: state.repo.success,
    hasRepos: state.repo.hasRepos,
    commits: state.repo.commits,
    hasNext: state.repo.hasNext,
    loadingCommits: state.repo.loadingCommits,
    user: state.auth.user,
  };
};

export default connect(mapStateToProps, actions)(App);
