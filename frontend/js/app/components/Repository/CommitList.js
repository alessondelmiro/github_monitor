import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap/';
import { Link } from 'react-router-dom';
import useMedia from 'use-media';

const CommitList = ({ detail, commits, loading, showMore, hasNext }) => {
  const matches = useMedia({ maxWidth: '768px' });
  return (
    <div className="list-container">
      {loading && (!commits || commits.length === 0) ? (
        <div className="centered fit-width">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : commits && commits.length > 0 ? (
        <div className="table-responsive">
          {matches ? (
            <table className="table">
              <tbody>
                {commits.map((commit) => (
                  <tr key={commit.sha.slice(0, 7)}>
                    <td className="message-col">
                      <div className="summary-message">
                        <OverlayTrigger
                          key={commit.message}
                          overlay={
                            <Tooltip id={`tooltip-${commit.message}`}>{commit.message}</Tooltip>
                          }
                        >
                          <span>{commit.message}</span>
                        </OverlayTrigger>
                      </div>
                      <div className="summary-infos">
                        <span>{commit.author.name}</span>
                      </div>
                      <div className="summary-infos">
                        <span>
                          {commit.sha.slice(0, 7)} - {moment(commit.created).format('ll')}
                        </span>
                      </div>
                      {detail ? null : (
                        <div>
                          <span>
                            <Link to={`repository/${commit.repository_id}`}>
                              {commit.repository_name}
                            </Link>
                          </span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
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
                  <tr key={commit.sha.slice(0, 7)}>
                    <th className="author-row" scope="row">
                      {commit.author.name}
                    </th>
                    <td>{commit.sha.slice(0, 7)}</td>
                    <td className="message-col">
                      <OverlayTrigger
                        key={commit.message}
                        overlay={
                          <Tooltip id={`tooltip-${commit.message}`}>{commit.message}</Tooltip>
                        }
                      >
                        <span>{commit.message}</span>
                      </OverlayTrigger>
                    </td>
                    {detail ? null : (
                      <td>
                        <Link to={`repository/${commit.repository_id}`}>
                          {commit.repository_name}
                        </Link>
                      </td>
                    )}
                    <td>{moment(commit.created).format('ll')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {hasNext ? (
            <div className="show-more">
              <button className="btn btn-sm btn-secondary" type="button" onClick={showMore}>
                Show more
              </button>
            </div>
          ) : null}
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

CommitList.defaultProps = {
  detail: true,
};

CommitList.propTypes = {
  detail: PropTypes.bool,
  commits: PropTypes.array,
  loading: PropTypes.bool,
  showMore: PropTypes.func,
  hasNext: PropTypes.bool,
};

export default CommitList;
