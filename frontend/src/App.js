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
function App() {
  return (
    <>
      <Router>
        <Navbar/>
        <Routes>
          <Route exact path="/" element= {<Home/>}></Route>
          <Route exact path="/Login" element= {<Login/>}></Route>
          <Route exact path="/SignUp" element= {<SignUp/>}></Route>
        </Routes>
        
      </Router>
      
    </>
  );
}

export default App;
