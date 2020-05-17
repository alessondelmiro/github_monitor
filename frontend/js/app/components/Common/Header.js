import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <nav className="navbar navbar-dark bg-dark d-flex justify-content-start">
      <Link to="/">
        <div className="navbar-brand">GitHub Monitor</div>
      </Link>
      <div>
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link to="/">
              <div className="nav-link">Home</div>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Header;
