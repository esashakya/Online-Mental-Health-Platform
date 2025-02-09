import "./App.css";
import "./Admin.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/user/Navbar";
import Home from "./components/user/Home";
import Login from "./components/user/Login";
import SignUp from "./components/user/SignUp";
import Doctor from "./components/user/Doctor";
import Forum from "./components/user/Forum";
import Blog from "./components/user/Blog";
import SearchBar from "./components/user/SearchBar";
import Music from "./components/user/Music";
import Category from "./components/user/Category";
import Exercise from "./components/user/Exercise";
import Mood from "./components/user/Mood";

import AdminPanel from "./components/admin/AdminPanel";
import Dashboard from "./components/admin/Dashboard";

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* user web */}
          <Route path="/" element={<Navbar />}>
            <Route index element={<Home />} />
            {/* <Route exact path="/" element= {<Home/>}></Route> */}
            <Route exact path="/Login" element={<Login />}></Route>
            <Route exact path="/SignUp" element={<SignUp />}></Route>
            <Route exact path="/Doctor" element={<Doctor />}></Route>
            <Route exact path="/Forum" element={<Forum />}></Route>
            <Route exact path="/Blog" element={<Blog />}></Route>
            <Route exact path="/SearchBar" element={<SearchBar />}></Route>
            <Route exact path="/Music" element={<Music />}></Route>
            <Route exact path="/Category" element={<Category />}></Route>
            <Route exact path="/Exercise" element={<Exercise />}></Route>
            <Route exact path="/Mood" element={<Mood />}></Route>
          </Route>
          {/* admin web */}
          <Route path="/admin" element={<Dashboard />}>
            <Route index element={<Dashboard />} />
            
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
