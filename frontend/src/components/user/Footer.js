import React from 'react'
import { Link } from 'react-router-dom';
export default function Footer() {
    return (
      <footer className="bg-light py-5 mt-5 border-top">
        <div className="container">
          <div className="row">
           
            <div className="col-md-4 mb-4">
              <h5 className="mb-3">Untangle Chaos</h5>
              <p className="text-muted">
                Entangle your mental chaos with our professional and licensed doctors.
                Our licensed doctors are here to help and be in your journey.
              </p>
            </div>
  
         
            <div className="col-md-4 mb-4">
              <h6 className="mb-3">Quick Links</h6>
              <ul className="list-unstyled">
                <li><Link to="/Music" className="text-muted text-decoration-none d-block mb-2">Music Recommendation</Link></li>
                <li><Link to="/Doctor" className="text-muted text-decoration-none d-block mb-2">Our Doctors</Link></li>
                <li><Link to="/Forum" className="text-muted text-decoration-none d-block mb-2">Forum</Link></li>
                <li><Link to="/Blog" className="text-muted text-decoration-none d-block">View Our Blogs</Link></li>
              </ul>
            </div>
  
            {/* Social Section */}
            <div className="col-md-4 mb-4">
              <h6 className="mb-3">Follow Us</h6>
              <div className="d-flex gap-3">
                <a href="#" className="text-muted fs-5">
                  <i className="bi bi-facebook"></i>
                </a>
                <a href="#" className="text-muted fs-5">
                  <i className="bi bi-twitter"></i>
                </a>
                <a href="#" className="text-muted fs-5">
                  <i className="bi bi-instagram"></i>
                </a>
                <a href="#" className="text-muted fs-5">
                  <i className="bi bi-linkedin"></i>
                </a>
              </div>
            </div>
          </div>
  
         
          <div className="text-center pt-4 border-top mt-4 text-muted small">
            © {new Date().getFullYear()} UntangleChaos. All rights reserved.
          </div>
        </div>
      </footer>
    );
  }
  
