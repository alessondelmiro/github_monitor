import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

const CommitList = ({ detail, commits }) => {
  return (
    <div className="list-container">
      {commits && commits.length > 0 ? (
        <table className="table table-fix">
          <thead className="thead-light">
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
          </thead>
          <tbody>
            {commits.map((commit) => (
              <tr key={commit.id}>
                <th className="author-row" scope="row">
                  {commit.author}
                </th>
                <td>{commit.commit}</td>
                <td className="message-col">{commit.message}</td>
                {detail ? null : (
                  <Link to={`/repository/${commit.repository.id}`}>
                    <td>{commit.repository.name}</td>
                  </Link>
                )}
                <td>{commit.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
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
