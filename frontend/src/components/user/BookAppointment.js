import React, {useContext, useEffect, useState } from "react";

import { useParams } from "react-router-dom";
import AuthContext from '../../context/AuthContext'
const msg = require("sweetalert2");
const AppointmentForm = () => {
  const {user} = useContext(AuthContext)
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    message: "",
  });

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/doctors/${id}`);
        const data = await response.json();
        setDoctor(data);
      } catch (error) {
        console.error("Error fetching doctor details:", error);
      }
    };

    fetchDoctorDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   console.log('Appointment Details:', formData);
  //   alert('Appointment submitted!');
  // };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    const appointmentData = {
      user_id: user?.user_id,
      doctor_id: parseInt(id, 10),  // Get doctor ID from URL
      
      date_time: `${formData.date}T${formData.time}:00Z`, // Combine date & time in ISO format
      message: formData.message,
    };
    console.log(appointmentData);
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/api/book/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("authToken")}`, // Send user token
        },
        body: JSON.stringify(appointmentData),
      });
      setLoading(false);
      const result = await response.json();
      console.log("API Response:", result);
     
      if (response.ok) {
        msg.fire({
          title: 'Appointment registered successfully.!',
          text: 'You will get confirmation email about your appointment shortly.',
          icon: 'success',
          confirmButtonText: 'Okay',
          background: '#28a745',
          color: '#fff',
        });
        setFormData({
          name: "",
          email: "",
          phone: "",
          date: "",
          time: "",
          message: "",
        });
      } else {
        msg.fire({
          title: 'Something went wrong. Please try again.',
          text: 'Invalid data field, please check your entered data is correct or not',
          icon: 'error',
          confirmButtonText: 'Try again',
          background: '#dc3545',
          color: '#fff',
        });
      }
    } catch (error) {
      console.error("Error submitting appointment:", error);
      msg.fire({
        title: 'Oops!Server error',
        text: 'Sorry for inconvenience. Please try again in few minutes',
        icon: 'error',
        confirmButtonText: 'Try Again',
        background: '#dc3545',
        color: '#fff',
      });
    }
    
  };
  

  if (!doctor) {
    return <h2 className="text-center text-muted">Loading..</h2>;
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-3 fw-bold">Book an Appointment</h2>
      {loading && (
          <div className="d-flex justify-content-center mb-3">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Doctor's Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={doctor.user?.user_fullname || "Loading..."}
            disabled
          />
        </div>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Full Name
          </label>
          <input type="text" className="form-control" id="name" name="name"
    value={user.user_fullname || ""} disabled />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={user.user_email || ""}
            disabled
          />
        </div>

        

        <div className="mb-3">
          <label htmlFor="date" className="form-label">
            Appointment Date
          </label>
          <input
            type="date"
            className="form-control"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="time" className="form-label">
            Appointment Time
          </label>
          <input
            type="time"
            className="form-control"
            id="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="message" className="form-label">
            Message
          </label>
          <textarea
            className="form-control"
            id="message"
            name="message"
            rows="3"
            value={formData.message}
            onChange={handleChange}
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary">
          Submit Appointment
        </button>
      </form>
    </div>
  );
};

export default AppointmentForm;
