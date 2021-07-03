import * as React from 'react';
import { Alert, Button, Form } from 'react-bootstrap';
import axios from 'axios';

class UpdateTeachingRecords extends React.Component<{}, any> {
  constructor(props: {} | Readonly<{}>) {
    super(props);

    this.onChangeFileInput = this.onChangeFileInput.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      fileInput: '',
      is204: null,
      is400: null,
      is500: null,
    };
  }

  onChangeFileInput(e: any) {
    this.setState({
      fileInput: e.target.files[0],
      is204: null,
      is400: null,
      is500: null,
    });
  }

  onSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();

    if (!this.state.fileInput) {
      this.setState({ is400: true });
    } else {
      const formData = new FormData();
      formData.append('data', this.state.fileInput, this.state.fileInput.name);
      console.log(this.state.fileInput);

      axios
        .post(`http://localhost:3000/api/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then((res) => {
          console.log(res.data);
          this.setState({ is204: true });
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

      this.setState({ fileInput: '' });
    }
  }
  render() {
    return (
      <div className="update-teaching-records">
        {this.state.is204 ? (
          <Alert variant="success">
            You have successfully updated the Teaching Records.
          </Alert>
        ) : this.state.is400 ? (
          <Alert variant="danger">
            Validation for the .csv file has failed.
          </Alert>
        ) : this.state.is500 ? (
          <Alert variant="danger">
            An error has occurred, please check your file and try again.
          </Alert>
        ) : (
          ''
        )}
        <h1>Update Teaching Records</h1>
        <Form onSubmit={this.onSubmit}>
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>
              Upload Teaching Records (in .csv) for Update
            </Form.Label>
            <Form.Control
              required
              type="file"
              onChange={this.onChangeFileInput}
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

export default UpdateTeachingRecords;
