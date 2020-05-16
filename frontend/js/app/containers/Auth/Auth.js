import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import actions from '../../../redux/actions';

import CheckUser from './CheckUser';
import GithubAuth from './GithubAuth';

const Auth = ({ authenticate, authenticated }) => {
  const token = localStorage.getItem('token');
  useEffect(() => {
    if (token !== null) {
      authenticate(token);
    }
  }, [token]);

  return (
    <div className="container">
      <div className="row">
        <div className="col-sm-9 col-md-7 col-lg-5 centered">
          <div className="card card-signin">
            <div className="card-body">{authenticated ? <CheckUser /> : <GithubAuth />}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

Auth.propTypes = {
  authenticate: PropTypes.func,
  authenticated: PropTypes.bool,
};

const mapStateToProps = (state) => {
  return {
    error: state.auth.error,
    authenticated: state.auth.authenticated,
  };
};

export default connect(mapStateToProps, actions)(Auth);
