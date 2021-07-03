import * as React from 'react';
import UpdateClass from './UpdateClass';

class ClassList extends React.Component {
  render() {
    return (
      <div className="class-list">
        <UpdateClass />
        <h1>Class List (TODO)</h1>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Code</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            <tr>
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

export default ClassList;
