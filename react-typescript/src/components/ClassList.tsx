import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Alert, Table, Pagination } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import axios from 'axios';
import UpdateClass from './UpdateClass';

const MAX_CLASSES_PER_PAGE = 2;

type ClassListParams = {
  pageId: string;
};

type ClassListProps = RouteComponentProps<ClassListParams>;

class ClassList extends React.Component<
  ClassListProps,
  {
    displayClassesList: [];
    pageItems: [];
    is200: boolean | null;
    is500: boolean | null;
  }
> {
  classesCount: number = 0;
  classesList: any[] = [];

  constructor(props: ClassListProps) {
    super(props);

    this.state = {
      displayClassesList: [],
      pageItems: [],
      is200: null,
      is500: null,
    };
  }

  rerender = async () => {
    await this.retrieveClassesList();
    if (parseInt(this.props.match.params.pageId) === 1) {
      this.generateClassesListByPageId(1);
    } else {
      this.props.history.push(`/classes/1`);
    }
  };

  async componentDidMount() {
    await this.retrieveClassesList();
    if (this.props.match.params.pageId) {
      this.generateClassesListByPageId(
        parseInt(this.props.match.params.pageId)
      );
    } else {
      this.props.history.push(`/classes/1`);
    }
  }

  componentDidUpdate(prevProps: ClassListProps) {
    if (this.props.match.params.pageId !== prevProps.match.params.pageId) {
      if (!this.props.match.params.pageId) {
        this.props.history.push(`/classes/1`);
      } else {
        this.generateClassesListByPageId(
          parseInt(this.props.match.params.pageId)
        );
      }
    }
  }
  generateTableList(classes: any[], pageId: number): any {
    let classesArray: any[] = [];
    for (let index = 0; index < classes.length; index++) {
      const classConst: any = classes[index];
      classesArray.push(
        React.createElement(
          'tr',
          { key: index + 1 + (pageId - 1) * MAX_CLASSES_PER_PAGE },
          React.createElement(
            'td',
            {},
            index + 1 + (pageId - 1) * MAX_CLASSES_PER_PAGE
          ),
          React.createElement('td', {}, classConst.id),
          React.createElement('td', {}, classConst.code),
          React.createElement('td', {}, classConst.name),
          React.createElement('td', {}, classConst.createdAt),
          React.createElement('td', {}, classConst.updatedAt)
        )
      );
    }
    return React.createElement('tbody', {}, classesArray);
  }

  generatePageItems(count: number, pageId: number): any {
    const numberOfPages = Math.ceil(count / MAX_CLASSES_PER_PAGE);
    const pageItemsArray: any[] = [];
    for (let index = 0; index < numberOfPages; index++) {
      const toLink = `/classes/${index + 1}`;
      pageItemsArray.push(
        <LinkContainer key={index + 1} to={toLink}>
          <Pagination.Item active={index + 1 === pageId}>
            {index + 1}
          </Pagination.Item>
        </LinkContainer>
      );
    }
    return pageItemsArray;
  }

  async retrieveClassesList(): Promise<void> {
    await axios
      .get(`http://localhost:3000/api/classes`)
      .then((res) => {
        //console.log(res.data);
        this.setState({
          is200: true,
        });
        this.classesCount = res.data.length;
        this.classesList = res.data;
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status === 500) {
          this.setState({ is500: true });
        }
      });
  }

  generateClassesListByPageId(pageId: number) {
    const offset = (pageId - 1) * MAX_CLASSES_PER_PAGE;
    this.setState({
      is200: true,
      displayClassesList: this.generateTableList(
        this.classesList.slice(offset, offset + MAX_CLASSES_PER_PAGE),
        parseInt(this.props.match.params.pageId)
      ),
      pageItems: this.generatePageItems(
        this.classesCount,
        parseInt(this.props.match.params.pageId)
      ),
    });
  }
  render() {
    return (
      <div className="class-list">
        <UpdateClass rerender={this.rerender} />
        {this.state.is200 ? (
          <Alert variant="success">
            You have successfully retrieved the Classes List.
          </Alert>
        ) : this.state.is500 ? (
          <Alert variant="danger">
            An error has occurred, please try again.
          </Alert>
        ) : (
          ''
        )}
        <h1>Classes List</h1>
        <h5>Classes Count: {this.classesCount}</h5>
        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th>#</th>
              <th>ID</th>
              <th>Code</th>
              <th>Name</th>
              <th>Created At</th>
              <th>Updated At</th>
            </tr>
          </thead>
          {this.state.displayClassesList}
        </Table>
        <Pagination>{this.state.pageItems}</Pagination>
      </div>
    );
  }
}

export default withRouter(ClassList);
