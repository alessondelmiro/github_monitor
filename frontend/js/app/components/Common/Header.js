import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const logout = () => {
    localStorage.clear();
    window.location.replace('/login');
  };

  return (
    <nav className="navbar navbar-dark bg-dark d-flex justify-content-between">
      <Link to="/">
        <div className="navbar-brand">GitHub Monitor</div>
      </Link>
      <button className="btn btn-sm btn-secondary" type="button" onClick={logout}>
        Logout
      </button>
    </nav>
  );
};

export default Header;
