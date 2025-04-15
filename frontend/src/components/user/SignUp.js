import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
const msg = require("sweetalert2");
export default function SignUp() {
  const { registerNewUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    userEmail: '',
    userFullName: '',
    userPassword: '',
    userRetypePassword: '',
    userGender: '1' 
  });

  

  const isFormValid = () => {
    return (
      formData.userEmail.trim() && 
      formData.userFullName.trim() && 
      formData.userPassword && 
      formData.userRetypePassword
    );
  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    // prevent refreshing the page
    e.preventDefault();
    if (!isFormValid()) return;
    //gather the information from input tag
    
    const userEmail = e.target.userEmail.value;
    const userFullName = e.target.userFullName.value;
    const userPassword = e.target.userPassword.value;
    if (userPassword.length < 8) {
      msg.fire({
        title: "Password format incorrect",
        icon: "error",
        toast: true,
        timer: 5000,
        position: "top-right",
        text: "Password length must be atleast 8 characters",
        
      });
      return;
    }
    const userRetypePassword = e.target.userRetypePassword.value;
    const userGender = e.target.userGender.value;

    // check if user has entered
    userEmail.length > 0 &&
      registerNewUser(
        userEmail,
        userFullName,
        userPassword,
        userRetypePassword,
        userGender
      );
  };
  return (
    <div>
      <div className="container">
        <div className="row form bg-light rounded-3 shadow">
          <div className="col-md-6 d-flex align-items-stretch p-0">
            <img
              src="http://localhost:8000/media/lobbyImg.png"
              alt="image"
              className="w-100 h-100 object-fit-cover rounded-start"
              style={{ objectFit: "cover" }}
            />
          </div>

          <div className="col-md-6 pt-4 text-center mb-3">
            <h1>Sign Up</h1>
            <form className="signUpForm" onSubmit={handleSubmit}>
              <div className="input-group mb-3 pt-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Email Address"
                  name="userEmail"
                  aria-label="Username"
                  onChange={handleChange}
                />
              </div>
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="User Full Name"
                  name="userFullName"
                  aria-label="UserFullName"
                  onChange={handleChange}
                />
              </div>
              <div className="input-group mb-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  name="userPassword"
                  aria-describedby="passwordHelpBlock"
                  onChange={handleChange}
                />
              </div>
              <div className="input-group mb-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Retype The Password"
                  name="userRetypePassword"
                  aria-describedby="passwordHelpBlock"
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3 text-start">
                <label className="form-label">Gender:</label>
                <div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="userGender"
                      onChange={handleChange}
                      value="1"
                      checked
                    />
                    <label className="form-check-label">Male</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="userGender"
                      onChange={handleChange}
                      value="2"
                    />
                    <label className="form-check-label">Female</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="userGender"
                      onChange={handleChange}
                      value="3"
                    />
                    <label className="form-check-label">Other</label>
                  </div>
                </div>
              </div>

              <div className="form-text mb-2">
                Already have an account.
                <Link className="signLink" to="/Login">
                  Log In
                </Link>
              </div>
              <button type="submit" className="btn btn-primary" disabled={!isFormValid()}>
                Sign Up
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
