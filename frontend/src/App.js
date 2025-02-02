import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Doctor from './components/Doctor';
import Forum from './components/Forum';
import Blog from './components/Blog';


function App() {
  return (
    <>
      <Router>
        <Navbar/>
        <Routes>
          <Route exact path="/" element= {<Home/>}></Route>
          <Route exact path="/Login" element= {<Login/>}></Route>
          <Route exact path="/SignUp" element= {<SignUp/>}></Route>
          <Route exact path="/Doctor" element= {<Doctor/>}></Route>
          <Route exact path="/Forum" element= {<Forum/>}></Route>
          <Route exact path="/Blog" element= {<Blog/>}></Route>
        

        </Routes>
        
      </Router>
      
    </>
  );
}

export default App;
