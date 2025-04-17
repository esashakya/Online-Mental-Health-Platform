import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';

export default function AdminPanel() {
  const [isNavbarVisible, setIsNavbarVisible] = useState(false);

  const toggleNavbar = () => {
    setIsNavbarVisible(!isNavbarVisible);
  };

  const closeNavbar = () => {
    setIsNavbarVisible(false);
  };

  return (
    <div className="container-fluid">
      <div className="row">

        {/* Mobile Topbar */}
        <div className="d-md-none bg-dark text-white p-3 d-flex justify-content-between align-items-center">
          <span className="fw-bold">Admin Panel</span>
          <button className="btn btn-outline-light" onClick={toggleNavbar}>
            ☰
          </button>
        </div>

        {/* Sidebar (Offcanvas on Mobile, Static on Desktop) */}
        <div
          className={`col-12 col-md-3 col-lg-2 bg-dark text-light p-4 position-fixed top-0 ${
            isNavbarVisible ? 'd-block' : 'd-none'
          } d-md-block h-100`}
          style={{ zIndex: 1040 }}
        >
          <div className="text-center mb-4">
            <img
              src="http://localhost:8000/media/admin.png"
              alt="Admin"
              className="img-fluid rounded-circle mb-2"
              style={{ width: '80px' }}
            />
            <div className="fw-bold">UntangleChaos</div>
            <hr className="bg-secondary" />
          </div>

          <ul className="nav flex-column">
            <li className="nav-item">
              <Link onClick={closeNavbar} to="RegisteredUsers" className="nav-link text-light">
                Registered User Accounts
              </Link>
            </li>
            <li className="nav-item">
              <Link onClick={closeNavbar} to="RegisteredDoctorUsers" className="nav-link text-light">
                Registered Doctor Accounts
              </Link>
            </li>
            <li className="nav-item">
              <Link onClick={closeNavbar} to="Schedule/Forums" className="nav-link text-light">
                Forum
              </Link>
            </li>
            <li className="nav-item">
              <Link onClick={closeNavbar} to="Post/Blog" className="nav-link text-light">
                Blog
              </Link>
            </li>
            <li className="nav-item">
              <Link onClick={closeNavbar} to="RegisteredMusics" className="nav-link text-light">
                Music
              </Link>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className={`col-md-9 offset-md-3 col-lg-10 offset-lg-2 p-4`}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
