// import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import actions from '../../../redux/actions';

import CheckUser from './CheckUser';
import GithubAuth from './GithubAuth';

const Auth = () => {
  const token = localStorage.getItem('token');
  return (
    <div className="full-container">
      <div className="row">
        <div className="col-sm-9 col-md-7 col-lg-5 centered">
          <div className="card card-signin">
            <div className="card-body">{token ? <CheckUser token={token} /> : <GithubAuth />}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    error: state.auth.error,
  };
};

export default connect(mapStateToProps, actions)(Auth);
