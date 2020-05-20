import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import actions from '../../../redux/actions';
import Header from '../Common/Header';

const RepoDetail = ({ getRepo, repository, match, loading }) => {
  const { id } = match.params;

  console.log('repository', repository);
  useEffect(() => {
    getRepo(id);
  }, []);

  return (
    <div>
      <Header />
      <div className="search-container">
        {loading ? (
          <div className="centered fit-width">
            <div className="spinner-border" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : (
          <div>
            <h4 className="title">{repository ? repository.name : null}</h4>
          </div>
        )}
      </div>
    </div>
  );
};

RepoDetail.propTypes = {
  getRepo: PropTypes.func,
  repository: PropTypes.object,
  match: PropTypes.object,
  loading: PropTypes.bool,
};

const mapStateToProps = (state) => {
  return {
    repository: state.repo.repository,
    loading: state.repo.loading,
  };
};

export default connect(mapStateToProps, actions)(RepoDetail);
