import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import UserTable from "./UserTable";
import {Link} from 'react-router-dom';

export default function AdminPanel() {
  const [isNavbarVisible, setIsNavbarVisible] = useState(false);

  
  const changeNavbar = () => {
    setIsNavbarVisible(!isNavbarVisible);
  };

  return (
    <div className='admin-container'>
      {/* Button */}
      <button 
        className="navbar-toggle-btn d-md-none" 
        onClick={changeNavbar}
      >
        ☰
      </button>

      {/* Navbar */}
      <div 
        className={`d-flex flex-column p-5 bg-admin text-light  fw-lighter admin-nav justify-content-center ${isNavbarVisible ? 'show-navbar' : 'hide-navbar'}`} 
        style={{height: "100%"}}
      >
        <div className='d-flex flex-column justify-content-center align-items-center mb-4'>
          <div className='adminProfile mb-2'>
            <img src="http://localhost:8000/media/admin.png" alt="Admin Profile" />
          </div>
          <span>UntangleChaos</span>
          <hr />
        </div>

        <div className='mb-4'>
          <ul>
            <li><Link to="RegisteredUsers" className='text-decoration-none text-reset'>Registered User Accounts</Link></li>
            <li><Link to="RegisteredDoctorUsers" className='text-decoration-none text-reset'>Registered Doctor Accounts</Link></li>
            <li><Link to="Schedule/Appointments" className='text-decoration-none text-reset'>Appointments</Link></li>
            <li>Admin Profile</li>
          </ul>
        </div>
      </div>

      
      <div className='admin-content'>
        <Outlet />
      </div>
    </div>
  );
}
