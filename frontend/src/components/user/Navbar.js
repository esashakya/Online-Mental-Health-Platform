import React, { useContext } from "react";
import { jwtDecode } from "jwt-decode";
import AuthContext from "../../context/AuthContext";
import { Link, Outlet } from "react-router-dom";

export default function Navbar() {
  const { user, logoutRegisteredUser } = useContext(AuthContext);
  const token = localStorage.getItem("authTokens");

  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-body-tertiary py-4">
        <div className="container-fluid px-4">
          
          {/* logo */}
          <Link className="navbar-brand text-info-emphasis" to="/">
            <h3 className="m-0">Untangle Chaos</h3>
          </Link>

         
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarContent"
            aria-controls="navbarContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarContent">
            
    
            <ul className="navbar-nav ms-auto me-4">
              <li className="nav-item mx-3">
                <Link className="nav-link active" to="/">Home</Link>
              </li>
              <li className="nav-item mx-3">
                <Link className="nav-link" to="/Doctor">Make An Appointment</Link>
              </li>
              <li className="nav-item mx-3">
                <Link className="nav-link" to="/Forum">Forum</Link>
              </li>
              <li className="nav-item dropdown mx-3">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Explore
                </a>
                <ul className="dropdown-menu">
                  <li><Link className="dropdown-item" to="/Music">Music Recommendation</Link></li>
                  <li><Link className="dropdown-item" to="/Exercise">Breathing Exercise</Link></li>
                  <li><Link className="dropdown-item" to="/Blog">Blogs</Link></li>
                  <li><Link className="dropdown-item" to="/Mood">Mood Tracker</Link></li>
                </ul>
              </li>
            </ul>

            <div className="d-flex gap-2 pe-3">
              {token == null ? (
                <Link className="btn btn-primary" to="/Login">
                  Login
                </Link>
              ) : (
                <>
                  <button
                    className="btn btn-primary"
                    onClick={logoutRegisteredUser}
                  >
                    <Link to="/Login" className="text-white text-decoration-none">
                      Logout
                    </Link>
                  </button>
                  <Link to="/Profile" className="btn btn-primary">
                    <i className="bi bi-person-circle me-2"></i>Profile
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
              {/* to render other components */}
      <Outlet />
    </div>
  );
}
