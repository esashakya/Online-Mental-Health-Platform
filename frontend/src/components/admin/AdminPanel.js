import React, { useState, useContext } from "react";
import { Outlet, Link } from "react-router-dom";
import AuthContext from "../../context/AuthContext";

export default function AdminPanel() {
  const [isNavbarVisible, setIsNavbarVisible] = useState(false);
  const { logoutRegisteredUser } = useContext(AuthContext);

  const toggleNavbar = () => setIsNavbarVisible(!isNavbarVisible);
  const closeNavbar = () => setIsNavbarVisible(false);

  return (
    <div className="container-fluid bg-light min-vh-100 p-0 d-flex">
    
      <div 
        className={`bg-light sidebar ${isNavbarVisible ? "show" : ""} d-md-block`}
        style={{ width: "280px" }}
      >
        <div className="d-flex flex-column h-100 p-3">
          <div className="text-center mb-4">
            <img
              src="http://localhost:8000/media/admin.png"
              alt="Admin"
              className="img-fluid rounded-circle shadow-sm mb-2"
              style={{ width: "80px" }}
            />
            <div className="fw-semibold text-primary">UntangleChaos</div>
            <hr className="d-none d-md-block" />
          </div>

          <ul className="nav nav-pills flex-column mb-auto">
            <li className="nav-item">
              <Link
                onClick={closeNavbar}
                to="/admin"
                className="nav-link link-dark fw-medium"
              >
                <i className="bi bi-speedometer2 me-2"></i> Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link
                onClick={closeNavbar}
                to="RegisteredUsers"
                className="nav-link link-dark fw-medium"
              >
                <i className="bi bi-people-fill me-2"></i> Registered Users
              </Link>
            </li>
            <li className="nav-item">
              <Link
                onClick={closeNavbar}
                to="RegisteredDoctorUsers"
                className="nav-link link-dark fw-medium"
              >
                <i className="bi bi-person-check me-2"></i> Doctor Accounts
              </Link>
            </li>
            <li className="nav-item">
              <Link
                onClick={closeNavbar}
                to="Schedule/Forums"
                className="nav-link link-dark fw-medium"
              >
                <i className="bi bi-info-square-fill me-2"></i> Forum
              </Link>
            </li>
            <li className="nav-item">
              <Link
                onClick={closeNavbar}
                to="Post/Blog"
                className="nav-link link-dark fw-medium"
              >
                <i className="bi bi-book me-2"></i> Blog
              </Link>
            </li>
            <li className="nav-item">
              <Link
                onClick={closeNavbar}
                to="RegisteredMusics"
                className="nav-link link-dark fw-medium"
              >
                <i className="bi bi-music-note-list me-2"></i> Music
              </Link>
            </li>
            <li className="nav-item">
              <Link
                onClick={closeNavbar}
                to="admin/comments"
                className="nav-link link-dark fw-medium"
              >
                <i className="bi bi-chat me-2"></i> Comments
              </Link>
            </li>
            <li className="nav-item">
              <Link
                onClick={closeNavbar}
                to="admin/reviews"
                className="nav-link link-dark fw-medium"
              >
                <i className="bi bi-star me-2"></i> Reviews
              </Link>
            </li>
          </ul>

          <div className="mt-auto">
            <hr className="d-none d-md-block" />
            <button 
              className="nav-link link-dark fw-medium w-100 text-start btn btn-link"
              onClick={() => {
                closeNavbar();
                logoutRegisteredUser();
              }}
            >
              <i className="bi bi-box-arrow-left me-2"></i> Logout
            </button>
          </div>
        </div>
      </div>


      <div className="flex-grow-1 overflow-auto">
  
        <div className="d-md-none bg-primary text-white p-3 d-flex justify-content-between align-items-center shadow-sm sticky-top">
          <span className="fw-bold">Admin Panel</span>
          <button 
            className="btn btn-outline-light" 
            onClick={toggleNavbar}
            aria-label="Toggle navigation"
          >
            <i className="bi bi-list"></i>
          </button>
        </div>

  
        <div className="p-3 p-md-4">
          <div className="bg-white rounded shadow-sm p-3 p-md-4 border border-light">
            <Outlet />
          </div>
        </div>
      </div>

      {isNavbarVisible && (
        <div 
          className="offcanvas-backdrop fade show d-md-none" 
          onClick={closeNavbar}
        ></div>
      )}

      
    </div>
  );
}