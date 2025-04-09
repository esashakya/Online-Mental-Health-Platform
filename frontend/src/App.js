import "./App.css";
import "./Admin.css";
import RestrictedRoute from "./utils/RestrictedRoute";
import { AuthProvider } from "./context/AuthContext";
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

import UserTable from "./components/admin/UserTable";
import Dashboard from "./components/admin/Dashboard";
import AdminPanel from "./components/admin/AdminPanel";
import DoctorTable from "./components/admin/DoctorTable";
import AdminForum from "./components/admin/AdminForum";
import AdminBlog from "./components/admin/AdminBlog";
import AdminMusic from "./components/admin/AdminMusic";

import JoinUs from "./components/user/JoinUs";
import PreferredDoctor from "./components/user/PreferredDoctor";
import BookAppointment from "./components/user/BookAppointment";
import UserProfile from "./components/user/UserProfile";
import AppointmentList from "./components/user/AppointmentList";
import VideoCall from "./components/user/VideoCall";
import CallLobby from "./components/user/CallLobby";
import BlogPage from "./components/user/BlogPage";
import Payment from "./components/user/Payment";
import ForumPost from "./components/user/ForumPost";



function App() {
  return (
    <>
      <Router>
        <AuthProvider>
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
              <Route exact path="/Profile" element={<UserProfile />}></Route>
              <Route exact path="/AppointmentList" element={<AppointmentList />}></Route>
              <Route exact path="/Appointment/VideoCall" element={<VideoCall />}></Route>
              <Route exact path="/Join/Doctor" element={<JoinUs />}></Route>
              <Route exact path="/Appointment/CallLobby" element={<CallLobby />}></Route>
              <Route exact path="/Appointment/Payment" element={<Payment />}></Route>
              <Route exact path="/Forum/:id" element={<ForumPost />}></Route>



              <Route exact path="/PreferredDoctor/:id" element={<PreferredDoctor />}></Route>
              <Route exact path="/Blog/:id" element={<BlogPage />}></Route>

              <Route exact path="/BookAppointment/:id" element={<BookAppointment />}></Route>



            </Route>
            {/* admin web */}
            <Route path="/admin" element={<AdminPanel />}>
              <Route index element={<Dashboard />} />
              <Route
                exact
                path="RegisteredUsers"
                element={<UserTable />}
              ></Route>
              <Route
                exact
                path="RegisteredDoctorUsers"
                element={<DoctorTable />}
              ></Route>
              <Route
                exact
                path="RegisteredMusics"
                element={<AdminMusic />}
              ></Route>
              <Route
                exact
                path="Schedule/Forums"
                element={<AdminForum/>}
              ></Route>
              <Route
                exact
                path="Post/Blog"
                element={<AdminBlog/>}
              ></Route>
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
