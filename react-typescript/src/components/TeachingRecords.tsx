import * as React from 'react';
import UpdateTeachingRecords from './UpdateTeachingRecords';

class TeachingRecords extends React.Component {
  render() {
    return (
      <div className="teaching-records">
        <UpdateTeachingRecords />
        <h1>Teaching Records (TODO)</h1>
        <table>
          <thead>
            <tr>
              <th>Teacher</th>
              <th>Student</th>
              <th>Class</th>
              <th>Subject</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default TeachingRecords;
