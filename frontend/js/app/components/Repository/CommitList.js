import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';

const CommitList = ({ detail, commits }) => {
  return (
    <div className="list-container">
      {commits && commits.length > 0 ? (
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
                  <td className="message-col">{commit.message}</td>
                  {detail ? null : <td>{commit.repository_name}</td>}
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
};

export default CommitList;
