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
import SearchBar from './components/SearchBar';
import Music from './components/Music';
import Category from './components/Category';
import Exercise from './components/Exercise';
import Mood from './components/Mood'

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
          <Route exact path="/SearchBar" element= {<SearchBar/>}></Route>
          <Route exact path="/Music" element= {<Music/>}></Route>
          <Route exact path="/Category" element={<Category/>}></Route>
          <Route exact path="/Exercise" element={<Exercise/>}></Route>
          <Route exact path="/Mood" element={<Mood/>}></Route>



        </Routes>
        
      </Router>
      
    </>
  );
}

export default App;
