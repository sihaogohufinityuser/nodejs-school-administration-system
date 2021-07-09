import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Alert, Table, Pagination, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import axios from 'axios';

const MAX_TEACHERS_PER_PAGE = 2;

type TeacherListParams = {
  pageId: string;
};

type TeacherListProps = RouteComponentProps<TeacherListParams>;

class TeacherList extends React.Component<
  TeacherListProps,
  {
    teachersCount: number;
    teachersList: string;
    pageItems: [];
    is200: boolean | null;
    is500: boolean | null;
  }
> {
  constructor(props: TeacherListProps) {
    super(props);

    this.startRetrieving = this.startRetrieving.bind(this);

    this.state = {
      teachersCount: 0,
      teachersList: '',
      pageItems: [],
      is200: null,
      is500: null,
    };

    if (props.match.params.pageId) {
      this.retrieveTeachersList(parseInt(this.props.match.params.pageId));
    }
  }

  componentDidUpdate(prevProps: TeacherListProps) {
    if (this.props.match.params.pageId !== prevProps.match.params.pageId) {
      if (!this.props.match.params.pageId) {
        this.props.history.push(`/teachers/1`);
      } else {
        this.retrieveTeachersList(parseInt(this.props.match.params.pageId));
      }
    }
  }

  startRetrieving() {
    this.props.history.push(`/teachers/1`);
  }

  generateTableList(teachers: [], pageId: number): any {
    let teachersArray: any[] = [];
    for (let index = 0; index < teachers.length; index++) {
      const teacher: any = teachers[index];
      teachersArray.push(
        React.createElement(
          'tr',
          {},
          React.createElement(
            'td',
            {},
            index + 1 + (pageId - 1) * MAX_TEACHERS_PER_PAGE
          ),
          React.createElement('td', {}, teacher.id),
          React.createElement('td', {}, teacher.email),
          React.createElement('td', {}, teacher.name),
          React.createElement('td', {}, teacher.createdAt),
          React.createElement('td', {}, teacher.updatedAt)
        )
      );
    }
    return React.createElement('tbody', {}, teachersArray);
  }

  generatePageItems(count: number, pageId: number): any {
    const numberOfPages = Math.ceil(count / MAX_TEACHERS_PER_PAGE);
    const pageItemsArray: any[] = [];
    for (let index = 0; index < numberOfPages; index++) {
      const toLink = `/teachers/${index + 1}`;
      pageItemsArray.push(
        <LinkContainer to={toLink}>
          <Pagination.Item key={index + 1} active={index + 1 === pageId}>
            {index + 1}
          </Pagination.Item>
        </LinkContainer>
      );
    }
    return pageItemsArray;
  }

  retrieveTeachersList(pageId: number): void {
    const offset = (pageId - 1) * MAX_TEACHERS_PER_PAGE;
    axios
      .get(
        `http://localhost:3000/api/teachers?offset=${offset}&limit=${MAX_TEACHERS_PER_PAGE}`
      )
      .then((res) => {
        console.log(res.data);
        this.setState({
          is200: true,
          teachersCount: res.data.length,
          teachersList: this.generateTableList(
            res.data,
            parseInt(this.props.match.params.pageId)
          ),
          pageItems: this.generatePageItems(
            res.data.length,
            parseInt(this.props.match.params.pageId)
          ),
        });
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status === 500) {
          this.setState({ is500: true });
        }
      });
  }

  render() {
    return (
      <div className="teacher-list">
        {this.state.is200 ? (
          <Alert variant="success">
            You have successfully retrieved the Teachers List.
          </Alert>
        ) : this.state.is500 ? (
          <Alert variant="danger">
            An error has occurred, please try again.
          </Alert>
        ) : (
          ''
        )}
        <h1>Teachers List</h1>
        <Button variant="primary" onClick={() => this.startRetrieving()}>
          Retrieve
        </Button>
        <h5>Teachers Count: {this.state.teachersCount}</h5>
        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th>#</th>
              <th>ID</th>
              <th>Email</th>
              <th>Name</th>
              <th>Created At</th>
              <th>Updated At</th>
            </tr>
          </thead>
          {this.state.teachersList}
        </Table>
        <Pagination>{this.state.pageItems}</Pagination>
      </div>
    );
  }
}

export default withRouter(TeacherList);
