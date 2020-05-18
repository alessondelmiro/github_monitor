import PropTypes from 'prop-types';
import React, { useEffect } from 'react';

const AddRepo = ({ error, success, submitForm, text, title, setText, placeholder }) => {
  function setNull() {
    error = null;
    success = null;
  }

  useEffect(() => {
    if (error || success) {
      setTimeout(setNull, 3000);
    }
  }, [error, success]);

  return (
    <div className="search-container">
      <div>
        <h4 className="title">{title}</h4>
        <form onSubmit={(e) => submitForm(e)}>
          <div className="input-group input-group-lg">
            <input
              className={`form-control ${error && !success ? 'is-invalid' : ''} ${
                !error && success ? 'is-valid' : ''
              }`}
              placeholder={placeholder}
              text={text}
              type="text"
              onChange={(e) => setText(e.target.value)}
            />
            <button className="btn btn-success submit" type="submit">
              Add
            </button>
          </div>
          {error ? (
            <div className="col-sm-6">
              <small className="text-danger">{error}</small>
            </div>
          ) : null}
          {success ? (
            <div className="col-sm-6">
              <small className="text-success">{success}</small>
            </div>
          ) : null}
        </form>
      </div>
    </div>
  );
};

AddRepo.propTypes = {
  error: PropTypes.string,
  success: PropTypes.string,
  submitForm: PropTypes.func,
  text: PropTypes.string,
  title: PropTypes.string,
  setText: PropTypes.func,
  placeholder: PropTypes.string,
};

export default AddRepo;
