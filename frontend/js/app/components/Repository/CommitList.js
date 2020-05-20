import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap/';
import { Link } from 'react-router-dom';

const CommitList = ({ detail, commits, loading }) => {
  return (
    <div className="list-container">
      {loading ? (
        <div className="centered fit-width">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : commits && commits.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-fix">
            <thead>
              <tr>
                <th className="author-col" scope="col">
                  Author
                </th>
                <th className="commit-col" scope="col">
                  Commit
                </th>
                <th scope="col">Message</th>
                {detail ? null : (
                  <th className="repo-col" scope="col">
                    Repository
                  </th>
                )}
                <th className="date-col" scope="col">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {commits.map((commit) => (
                <tr key={commit.sha.slice(0, 6)}>
                  <th className="author-row" scope="row">
                    {commit.author.name}
                  </th>
                  <td>{commit.sha.slice(0, 6)}</td>
                  <td className="message-col">
                    <OverlayTrigger
                      key={commit.message}
                      overlay={<Tooltip id={`tooltip-${commit.message}`}>{commit.message}</Tooltip>}
                    >
                      <span>{commit.message}</span>
                    </OverlayTrigger>
                  </td>
                  {detail ? null : (
                    <td>
                      <Link to={`repositories/${commit.repository_id}`}>
                        {commit.repository_name}
                      </Link>
                    </td>
                  )}
                  <td>{moment(commit.created).format('ll')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="d-flex flex-column align-items-center">
          <h4 className="title">Looks like you have not committed for the last 30 days</h4>
          <h6 className="title">As soon as you push something new, it will appear here</h6>
        </div>
      )}
    </div>
  );
};

CommitList.propTypes = {
  detail: PropTypes.bool,
  commits: PropTypes.array,
  loading: PropTypes.bool,
};

export default CommitList;
