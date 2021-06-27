import * as React from 'react';
import { Button, Form } from 'react-bootstrap';

class ClassList extends React.Component {
  render() {
    return (
      <div className="class-list">
        <h1>Update Class Name</h1>
        <Form>
          <Form.Group controlId="formClassCode">
            <Form.Label>Class Code</Form.Label>
            <Form.Control type="text" placeholder="Enter class code" />
          </Form.Group>

          <Form.Group controlId="formNewClassName">
            <Form.Label>New Class Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter new class name to update"
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
        <div className="className-update-list"></div>
        <h1>Class List</h1>
        <table>
          <tr>
            <th>ID</th>
            <th>Code</th>
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

export default ClassList;
