import * as React from 'react';

class StudentList extends React.Component {
  render() {
    return (
      <div className="student-list">
        <h1>Student List</h1>
        <table>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Name</th>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </table>
      </div>
    );
  }
}

export default StudentList;
