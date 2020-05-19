import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import Alert from 'react-bootstrap/Alert';

const AddRepo = ({ error, success, submitForm, text, title, setText, placeholder }) => {
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (error) {
      setShowError(true);
      setTimeout(function errorAlert() {
        setShowError(false);
      }, 3000);
    }
    if (success) {
      setShowSuccess(true);
      setTimeout(function successAlert() {
        setShowSuccess(false);
      }, 3000);
    }
  }, [error, success]);

  return (
    <div className="search-container">
      <Alert key="error-alert" show={showError} variant="danger">
        {error ? error.detail : ''}
      </Alert>
      <Alert key="success-alert" show={showSuccess} variant="success">
        {success ? success.detail : ''}
      </Alert>
      <div>
        <h4 className="title">{title}</h4>
        <form onSubmit={(e) => submitForm(e)}>
          <div className="input-group input-group-lg">
            <input
              className="form-control"
              placeholder={placeholder}
              text={text}
              type="text"
              onChange={(e) => setText(e.target.value)}
            />
            <button className="btn btn-success submit" type="submit">
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

AddRepo.propTypes = {
  error: PropTypes.object,
  success: PropTypes.object,
  submitForm: PropTypes.func,
  text: PropTypes.string,
  title: PropTypes.string,
  setText: PropTypes.func,
  placeholder: PropTypes.string,
};

export default AddRepo;
