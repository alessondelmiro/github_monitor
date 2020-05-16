import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import actions from '../../../redux/actions';

const CheckUser = ({ authenticated, checkUser, token }) => {
  const logout = () => {
    localStorage.clear();
    window.location.replace('/login');
  };

  useEffect(() => {
    if (token !== null) {
      checkUser(token);
      if (!authenticated) {
        logout();
      }
    }
  }, [token]);
  return (
    <>
      <h5 className="card-title text-center">Checking your credentials...</h5>
      <div className="centered fit-width">
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    </>
  );
};

CheckUser.propTypes = {
  authenticated: PropTypes.bool,
  checkUser: PropTypes.func,
  token: PropTypes.string,
};

const mapStateToProps = (state) => {
  return {
    error: state.auth.error,
    loading: state.auth.loading,
    authenticated: state.auth.authenticated,
    token: state.auth.token,
  };
};

export default connect(mapStateToProps, actions)(CheckUser);
