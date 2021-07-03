import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import { Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Home from './components/Home';
import TeacherList from './components/TeacherList';
import ClassList from './components/ClassList';
import StudentList from './components/StudentList';
import SubjectList from './components/SubjectList';
import TeachingRecords from './components/TeachingRecords';

const App: React.FC = (): JSX.Element => {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Nav variant="pills" defaultActiveKey="/">
            <Nav.Item>
              <LinkContainer to={'/'}>
                <Nav.Link>Home</Nav.Link>
              </LinkContainer>
            </Nav.Item>
            <Nav.Item>
              <LinkContainer to={'/teacher-list'}>
                <Nav.Link>Teacher List</Nav.Link>
              </LinkContainer>
            </Nav.Item>
            <Nav.Item>
              <LinkContainer to={'/student-list'}>
                <Nav.Link>Student List</Nav.Link>
              </LinkContainer>
            </Nav.Item>
            <Nav.Item>
              <LinkContainer to={'/class-list'}>
                <Nav.Link>Class List</Nav.Link>
              </LinkContainer>
            </Nav.Item>
            <Nav.Item>
              <LinkContainer to={'/subject-list'}>
                <Nav.Link>Subject List</Nav.Link>
              </LinkContainer>
            </Nav.Item>
            <Nav.Item>
              <LinkContainer to={'/teaching-records'}>
                <Nav.Link>Teaching Records</Nav.Link>
              </LinkContainer>
            </Nav.Item>
          </Nav>
          <hr />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/teacher-list" component={TeacherList} />
            <Route path="/student-list" component={StudentList} />
            <Route path="/class-list" component={ClassList} />
            <Route path="/subject-list" component={SubjectList} />
            <Route path="/teaching-records" component={TeachingRecords} />
          </Switch>
        </header>
      </div>
    </Router>
  );
};

export default App;
