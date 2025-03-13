import React, { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

const AppointmentForm = () => {
    const { id } = useParams(); 
    const [doctor, setDoctor] = useState(null);
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      phone: '',
      date: '',
      time: '',
      message: '',
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
  
    const handleSubmit = (e) => {
      e.preventDefault();
      console.log('Appointment Details:', formData);
      alert('Appointment submitted!');
    };
  
    if (!doctor) {
      return <h2 className="text-center text-muted">Loading..</h2>;
    }
  
    return (
      <div className="container mt-5">
        <h2 className='mb-3 fw-bold'>Book an Appointment</h2>
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
              value={doctor.user?.user_fullname || 'Loading...'} 
              disabled
            />
          </div>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Full Name
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
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
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="phone" className="form-label">
              Phone Number
            </label>
            <input
              type="text"
              className="form-control"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
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
  