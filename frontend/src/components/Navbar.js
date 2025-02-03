import React from "react";
import {Link} from 'react-router-dom'
export default function Navbar() {
  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-body-tertiary d-flex">
        <div className="container-fluid mt-3 mb-3">
          <a className="navbar-brand text-info-emphasis" href="#">
           <h3>Untangle Chaos</h3> 
          </a>
          <button className="login-btn ms-2 d-lg-none bg-primary" ><Link className='signLink' to="/Login" style={{ color: 'white', textDecoration:'none' }}>Login</Link></button>
          
          <button
            className="navbar-toggler mb-2"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarTogglerDemo02"
            aria-controls="navbarTogglerDemo02"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
            <ul className="navbar-nav navCenter mb-lg-0 ">
              <li className="nav-item navData">
                <Link className="nav-link active" aria-current="page" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item ml-5 navData">
                <Link className="nav-link" to="/Doctor">
                  Make An Appointment
                </Link>
              </li>
              <li className="nav-item navData">
                <Link className="nav-link" to="/Forum">
                  Forum
                </Link>
              </li>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle navData"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Explore
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <Link className="dropdown-item" to="/Music">
                      Music Recommendation
                    </Link>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Breathing Exercise
                    </a>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/Blog">
                      Blogs
                    </Link>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Mood Tracker
                    </a>
                  </li>
                </ul>
              </li>
              
            </ul>
            <button className="login-btn sm-ml-5 d-none d-lg-block bg-primary" ><Link className='signLink' to = "/Login" style={{ color: 'white', textDecoration:'none' }}>Login</Link></button>
          </div>
          
        </div>
      </nav>
    </div>
  );
}
