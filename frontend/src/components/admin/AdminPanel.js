import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';

export default function AdminPanel() {
  const [isNavbarVisible, setIsNavbarVisible] = useState(false);

  const toggleNavbar = () => setIsNavbarVisible(!isNavbarVisible);
  const closeNavbar = () => setIsNavbarVisible(false);

  return (
    <div className="container-fluid bg-light min-vh-100">
      <div className="row">

        {/* Mobile Topbar */}
        <div className="d-md-none bg-primary text-white p-3 d-flex justify-content-between align-items-center shadow-sm">
          <span className="fw-bold">Admin Panel</span>
          <button className="btn btn-outline-light" onClick={toggleNavbar}>
          <i class="bi bi-list"></i>
          </button>
        </div>

        {/* Sidebar */}
        <div
          className={`col-12 col-md-3 col-lg-2 p-4 position-fixed top-0 ${
            isNavbarVisible ? 'd-block' : 'd-none'
          } d-md-block h-100`}
          style={{
            backgroundColor: '#e6f2ff',
            borderRight: '1px solid #cfe2ff',
            zIndex: 1040,
          }}
        >
          <div className="text-center mb-4">
            <img
              src="http://localhost:8000/media/admin.png"
              alt="Admin"
              className="img-fluid rounded-circle shadow-sm mb-2"
              style={{ width: '80px' }}
            />
            <div className="fw-semibold text-primary">UntangleChaos</div>
            <hr />
          </div>

          <ul className="nav flex-column">
            <li className="nav-item mb-2">
              <Link onClick={closeNavbar} to="RegisteredUsers" className="nav-link link-dark admin-nav fw-medium">
              <i class="bi bi-people-fill"></i> Registered Users
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link onClick={closeNavbar} to="RegisteredDoctorUsers" className="nav-link link-dark admin-nav fw-medium">
              <i class="bi bi-person-check"></i> Doctor Accounts
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link onClick={closeNavbar} to="Schedule/Forums" className="nav-link link-dark admin-nav fw-medium">
              <i class="bi bi-info-square-fill"></i> Forum
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link onClick={closeNavbar} to="Post/Blog" className="nav-link link-dark admin-nav fw-medium">
              <i class="bi bi-book"></i> Blog
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link onClick={closeNavbar} to="RegisteredMusics" className="nav-link link-dark admin-nav fw-medium">
              <i class="bi bi-music-note-list"></i> Music
              </Link>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className={`col-md-9 offset-md-3 col-lg-10 offset-lg-2 p-4`}>
          <div className="bg-white rounded shadow-sm p-4 border border-light">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
