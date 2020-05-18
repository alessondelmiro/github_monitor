import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

const GithubAuth = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    window.location.replace(
      `https://github.com/login/oauth/authorize?client_id=${process.env.REACT_GITHUB_CLIENT_ID}&scope=read:user,user:email,repo,admin:repo_hook`
    );
  };

  return (
    <>
      <h5 className="card-title text-center">Sign In</h5>
      <form className="form-signin" onSubmit={handleSubmit}>
        <div>
          <button className="btn btn-lg btn-github btn-block text-uppercase" type="submit">
            <FontAwesomeIcon className="icon" icon={faGithub} />
            Sign in with GitHub
          </button>
        </div>
      </form>
    </>
  );
};

export default GithubAuth;
