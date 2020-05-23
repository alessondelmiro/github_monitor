import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import actions from '../../../redux/actions';
import Header from '../Common/Header';

import CommitList from './CommitList';

const RepoDetail = ({
  getRepo,
  getCommits,
  repository,
  match,
  loading,
  commits,
  hasNext,
  user,
}) => {
  let page = 1;
  const { id } = match.params;

  useEffect(() => {
    getRepo(id);
  }, []);

  const showMore = () => {
    if (hasNext) {
      page += 1;
      getCommits(page, id);
    }
  };

  return (
    <div>
      <Header user={user} />
      <div className="back">
        <Link to="/">
          <span> ← Back</span>
        </Link>
      </div>
      {loading ? (
        <div className="search-container">
          <div className="centered fit-width">
            <div className="spinner-border" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="search-container">
            <div className="detail-head">
              <h3 className="title">
                / <strong>{repository ? repository.name : null}</strong>
              </h3>
              <h6 className="title">
                <strong>{repository ? repository.commit_count : null}</strong>
                {repository && repository.commit_count === 1 ? ' commit' : ' commits'}
              </h6>
            </div>
            <div>
              <p className="description"> {repository ? repository.description : null} </p>
            </div>
          </div>
          <CommitList commits={commits} hasNext={hasNext} showMore={showMore} />
        </>
      )}
    </div>
  );
};

RepoDetail.propTypes = {
  getRepo: PropTypes.func,
  getCommits: PropTypes.func,
  repository: PropTypes.object,
  commits: PropTypes.array,
  hasNext: PropTypes.bool,
  match: PropTypes.object,
  loading: PropTypes.bool,
  user: PropTypes.object,
};

const mapStateToProps = (state) => {
  return {
    repository: state.repo.repository,
    commits: state.repo.commits,
    hasNext: state.repo.hasNext,
    loading: state.repo.loading,
    user: state.auth.user,
  };
};

export default connect(mapStateToProps, actions)(RepoDetail);
