import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import { Nav } from 'react-bootstrap';
import { IndexLinkContainer } from 'react-router-bootstrap';
import Home from './components/Home';
import TeacherList from './components/TeacherList';
import ClassList from './components/ClassList';
import StudentList from './components/StudentList';
import SubjectList from './components/SubjectList';
import TeachingRecords from './components/TeachingRecords';
import MyClass from './components/MyClass';
import Reports from './components/Reports';

const App: React.FC = (): JSX.Element => {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Nav variant="pills">
            <Nav.Item>
              <IndexLinkContainer to={'/'}>
                <Nav.Link>Home</Nav.Link>
              </IndexLinkContainer>
            </Nav.Item>
            <Nav.Item>
              <IndexLinkContainer to={'/teachers'}>
                <Nav.Link>Teacher List</Nav.Link>
              </IndexLinkContainer>
            </Nav.Item>
            <Nav.Item>
              <IndexLinkContainer to={'/student-list'}>
                <Nav.Link>Student List</Nav.Link>
              </IndexLinkContainer>
            </Nav.Item>
            <Nav.Item>
              <IndexLinkContainer to={'/classes'}>
                <Nav.Link>Class List</Nav.Link>
              </IndexLinkContainer>
            </Nav.Item>
            <Nav.Item>
              <IndexLinkContainer to={'/subject-list'}>
                <Nav.Link>Subject List</Nav.Link>
              </IndexLinkContainer>
            </Nav.Item>
            <Nav.Item>
              <IndexLinkContainer to={'/teaching-records'}>
                <Nav.Link>Teaching Records</Nav.Link>
              </IndexLinkContainer>
            </Nav.Item>
            <Nav.Item>
              <IndexLinkContainer to={'/my-class'}>
                <Nav.Link>My Class</Nav.Link>
              </IndexLinkContainer>
            </Nav.Item>
            <Nav.Item>
              <IndexLinkContainer to={'/reports'}>
                <Nav.Link>Reports</Nav.Link>
              </IndexLinkContainer>
            </Nav.Item>
          </Nav>
          <hr />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/teachers/:pageId?" component={TeacherList} />
            <Route path="/student-list" component={StudentList} />
            <Route path="/classes/:pageId?" component={ClassList} />
            <Route path="/subject-list" component={SubjectList} />
            <Route path="/teaching-records" component={TeachingRecords} />
            <Route path="/my-class/:classCode?/:pageId?" component={MyClass} />
            <Route path="/reports/:reportName?" component={Reports} />
          </Switch>
        </header>
      </div>
    </Router>
  );
};

export default App;
