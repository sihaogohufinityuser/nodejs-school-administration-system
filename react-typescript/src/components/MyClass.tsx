import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Alert, Form, Table, Pagination, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import axios from 'axios';

const MAX_STUDENTS_PER_PAGE = 10;

type MyClassParams = {
  classCode: string;
  pageId: string;
};

type MyClassProps = RouteComponentProps<MyClassParams>;

class MyClass extends React.Component<
  MyClassProps,
  {
    classCodeFormInput: string;
    allStudentsCount: number;
    allStudentsList: [];
    pageItems: [];
    is200: boolean | null;
    is400: boolean | null;
    is500: boolean | null;
  }
> {
  constructor(props: MyClassProps) {
    super(props);

    this.onChangeClassCode = this.onChangeClassCode.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      classCodeFormInput: '',
      allStudentsCount: 0,
      allStudentsList: [],
      pageItems: [],
      is200: null,
      is400: null,
      is500: null,
    };
  }

  componentDidMount() {
    if (this.props.match.params.classCode) {
      if (!this.props.match.params.pageId) {
        this.props.history.push(
          `/my-class/${this.props.match.params.classCode}/1`
        );
      } else {
        this.setState({
          classCodeFormInput: this.props.match.params.classCode,
        });
        this.retrieveMyClass(
          this.props.match.params.classCode,
          parseInt(this.props.match.params.pageId)
        );
      }
    }
  }

  componentDidUpdate(prevProps: MyClassProps) {
    if (
      this.props.match.params.classCode !== prevProps.match.params.classCode ||
      this.props.match.params.pageId !== prevProps.match.params.pageId
    ) {
      if (this.props.match.params.classCode) {
        if (!this.props.match.params.pageId) {
          this.props.history.push(
            `/my-class/${this.props.match.params.classCode}/1`
          );
        } else {
          this.retrieveMyClass(
            this.props.match.params.classCode,
            parseInt(this.props.match.params.pageId)
          );
        }
      } else {
        this.setState({
          classCodeFormInput: '',
          allStudentsCount: 0,
          allStudentsList: [],
          pageItems: [],
          is200: null,
          is400: null,
          is500: null,
        });
      }
    }
  }

  onChangeClassCode(e: { target: { value: any } }) {
    this.setState({
      classCodeFormInput: e.target.value,
      is200: null,
      is400: null,
      is500: null,
    });
  }

  onSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();

    this.props.history.push(`/my-class/${this.state.classCodeFormInput}/1`);
  }

  generateTableList(students: [], pageId: number): any {
    let allStudentsArray: any[] = [];
    for (let index = 0; index < students.length; index++) {
      const student: any = students[index];
      allStudentsArray.push(
        React.createElement(
          'tr',
          { key: index + 1 + (pageId - 1) * MAX_STUDENTS_PER_PAGE },
          React.createElement(
            'td',
            {},
            index + 1 + (pageId - 1) * MAX_STUDENTS_PER_PAGE
          ),
          React.createElement('td', {}, student.id),
          React.createElement('td', {}, student.name),
          React.createElement('td', {}, student.email),
          React.createElement('td', {}, student.group)
        )
      );
    }
    return React.createElement('tbody', {}, allStudentsArray);
  }

  generatePageItems(count: number, pageId: number): any {
    const numberOfPages = Math.ceil(count / MAX_STUDENTS_PER_PAGE);
    const pageItemsArray: any[] = [];
    for (let index = 0; index < numberOfPages; index++) {
      const toLink = `/my-class/${this.props.match.params.classCode}/${
        index + 1
      }`;
      pageItemsArray.push(
        <LinkContainer key={index + 1}  to={toLink}>
          <Pagination.Item active={index + 1 === pageId}>
            {index + 1}
          </Pagination.Item>
        </LinkContainer>
      );
    }
    return pageItemsArray;
  }

  retrieveMyClass(classCode: string, pageId: number): void {
    const offset = (pageId - 1) * MAX_STUDENTS_PER_PAGE;
    axios
      .get(
        `http://localhost:3000/api/class/${classCode}/students?offset=${offset}&limit=${MAX_STUDENTS_PER_PAGE}`
      )
      .then((res) => {
        //console.log(res.data);
        this.setState({
          is200: true,
          allStudentsCount: res.data.count,
          allStudentsList: this.generateTableList(
            res.data.students,
            parseInt(this.props.match.params.pageId)
          ),
          pageItems: this.generatePageItems(
            res.data.count,
            parseInt(this.props.match.params.pageId)
          ),
        });
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
  }

  render() {
    return (
      <div className="my-class">
        {this.state.is200 ? (
          <Alert variant="success">
            You have successfully retrieved your class information.
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
        <h1>Retrieve My Class</h1>
        <Form onSubmit={this.onSubmit}>
          <Form.Group controlId="formClassCode">
            <Form.Label>Class Code</Form.Label>
            <Form.Control
              required
              type="text"
              value={this.state.classCodeFormInput}
              onChange={this.onChangeClassCode}
              placeholder="Enter class code"
            />
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form.Group>
        </Form>
        <h1>My Class Information</h1>
        <h5>Students Count: {this.state.allStudentsCount}</h5>
        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th>#</th>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Group</th>
            </tr>
          </thead>
          {this.state.allStudentsList}
        </Table>
        <Pagination>{this.state.pageItems}</Pagination>
      </div>
    );
  }
}

export default withRouter(MyClass);
