import * as React from 'react';
import { Alert, Button, Form } from 'react-bootstrap';
import axios from 'axios';

class UpdateClass extends React.Component<
  {},
  {
    classCode: string;
    className: string;
    is200: boolean | null;
    is400: boolean | null;
    is500: boolean | null;
  }
> {
  constructor(props: {}) {
    super(props);

    this.onChangeClassCode = this.onChangeClassCode.bind(this);
    this.onChangeClassName = this.onChangeClassName.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      classCode: '',
      className: '',
      is200: null,
      is400: null,
      is500: null,
    };
  }

  onChangeClassCode(e: { target: { value: any } }) {
    this.setState({
      classCode: e.target.value,
      is200: null,
      is400: null,
      is500: null,
    });
  }

  onChangeClassName(e: { target: { value: any } }) {
    this.setState({
      className: e.target.value,
      is200: null,
      is400: null,
      is500: null,
    });
  }

  onSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();

    const classNamePutBody = {
      className: this.state.className,
    };

    axios
      .put(
        `http://localhost:3000/api/class/${this.state.classCode}`,
        classNamePutBody
      )
      .then((res) => {
        console.log(res.data);
        this.setState({ is200: true });
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status === 400) {
          this.setState({ is400: true });
        }
        if (error.response.status === 500) {
          this.setState({ is500: true });
        }
      });

    this.setState({ classCode: '', className: '' });
  }
  render() {
    return (
      <div className="update-class">
        {this.state.is200 ? (
          <Alert variant="success">
            You have successfully updated the Class Name.
          </Alert>
        ) : this.state.is400 ? (
          <Alert variant="danger">
            Class cannot be found, or your request contain empty values.
          </Alert>
        ) : this.state.is500 ? (
          <Alert variant="danger">
            An error has occurred, please check your request and try again.
          </Alert>
        ) : (
          ''
        )}
        <h1>Update Class Name</h1>
        <Form onSubmit={this.onSubmit}>
          <Form.Group controlId="formClassCode">
            <Form.Label>Class Code</Form.Label>
            <Form.Control
              required
              type="text"
              value={this.state.classCode}
              onChange={this.onChangeClassCode}
              placeholder="Enter class code"
            />
          </Form.Group>

          <Form.Group controlId="formNewClassName">
            <Form.Label>New Class Name</Form.Label>
            <Form.Control
              required
              type="text"
              value={this.state.className}
              onChange={this.onChangeClassName}
              placeholder="Enter new class name to update"
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </div>
    );
  }
}

export default UpdateClass;
