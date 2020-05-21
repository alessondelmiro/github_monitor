import PropTyes from 'prop-types';
import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <button
    ref={ref}
    type="button"
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  >
    {children}
  </button>
));

const Header = ({ user }) => {
  // TODO: FIX RELOAD AND LOGOUT PROBLEM
  const logout = () => {
    localStorage.clear();
    // window.location.replace('/#/login');
    window.history.pushState({ urlPath: '/#/login' }, '/#', '/#/login');
    window.location.reload();
  };

  return (
    <nav className="navbar navbar-dark bg-dark d-flex justify-content-between">
      <Link to="/">
        <div className="navbar-brand">GitHub Monitor</div>
      </Link>
      {user ? (
        <div className="user-info">
          <div>
            <h6 className="user-name">{user.username}</h6>
          </div>
          <Dropdown>
            <Dropdown.Toggle as={CustomToggle} id="dropdown-basic">
              <img alt="user" height="31" src={user.avatar} width="31" />▾
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={logout}>Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      ) : null}
    </nav>
  );
};

Header.propTypes = {
  user: PropTyes.object,
};

CustomToggle.propTypes = {
  children: PropTyes.any,
  onClick: PropTyes.func,
};

export default Header;
