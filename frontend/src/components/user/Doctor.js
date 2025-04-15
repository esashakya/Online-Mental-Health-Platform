import React, { useEffect, useState, useContext } from "react";
import SearchBar from "./SearchBar";
import { useNavigate } from "react-router-dom";

import AuthContext from "../../context/AuthContext";

const Swal = require("sweetalert2");

export default function Doctor() {
  const [doctor, setDoctor] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedDoctor, setExpandedDoctor] = useState(null);
  const {  user } = useContext(AuthContext);
  const navigate = useNavigate();

  
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/doctors");
        const data = await response.json();
        console.log("doctors:", data);
        setDoctor(data);
      } catch (error) {
        console.error("error caused due to:", error);
        setDoctor([]);
      }
    };

    fetchDoctors();
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const toggleTimeSlots = (doctorId) => {
    setExpandedDoctor(expandedDoctor === doctorId ? null : doctorId);
  };

 
  const formatTime = (timeString) => {
    if (!timeString) return "Not Available";
    
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    
    return `${hour12}:${minutes} ${ampm}`;
  };

  const filteredDoctors = doctor.filter((doctor) => {
    const fullName = doctor?.user?.user_fullname?.toLowerCase() || "";
    const email = doctor?.user?.user_email?.toLowerCase() || "";
    const degree = doctor?.doctor_degree?.toLowerCase() || "";

    return (
      fullName.includes(searchQuery.toLowerCase()) ||
      email.includes(searchQuery.toLowerCase()) ||
      degree.includes(searchQuery.toLowerCase())
    );
  });
  useEffect(() => {
      if (!user) {
        Swal.fire({
          title: "You need to be logged in",
          text: "Please log in to view our doctors.",
          icon: "warning",
          confirmButtonText: "Go to Login",
        }).then(() => {
          navigate("/login"); 
        });
      }
    }, [user, navigate]);
  return (
    <div>
      <div className="doctorsList text-center mt-4">
        <h1 style={{ color: "#194a7a" }}>Our Doctors</h1>
        <p className="fs-5 fst-italic">
          Our doctors are here to help. Feel free to consult with any doctor.
        </p>
      </div>
      <SearchBar searchQuery={searchQuery} onSearchChange={handleSearchChange}/>
      <div className="container shadow-sm p-3 mb-5 bg-body-tertiary rounded">
        <div className="row mb-5">
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map((doctor, index) => (
              <div
                key={index}
                className="col-sm-4 d-flex justify-content-center"
              >
                <div className="card mb-3" style={{ width: "20rem" }}>
                  <div className="doctor-img">
                    <img
                      src={`http://127.0.0.1:8000${doctor.doctor_photo}`}
                      className="card-img-top h-100 w-100 object-fit-cover"
                      alt="Doctor"
                    />
                  </div>

                  <div className="card-body text-center">
                    <h5 className="card-title fw-bold ">
                      {doctor?.user?.user_fullname || "No Name"}
                    </h5>
                    <p className="card-text fst-italic">
                      {doctor?.user?.user_email || "No Email"}
                    </p>
                    
                    <div className="mb-2">
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => toggleTimeSlots(doctor.id)}
                      >
                        {expandedDoctor === doctor.id ? 'Hide Time Slots' : 'View Time Slots'}
                      </button>
                      
                      {expandedDoctor === doctor.id && (
                        <div className="mt-2">
                          {doctor.time_slots && doctor.time_slots.length > 0 ? (
                            <div className="d-flex flex-column gap-2">
                              {doctor.time_slots.map((slot, slotIndex) => (
                                <button
                                  key={slotIndex}
                                  className="btn btn-sm btn-outline-secondary"
                                  disabled
                                >
                                  {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                                </button>
                              ))}
                            </div>
                          ) : (
                            <p className="text-muted small">No time slots available</p>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <p className="card-text">
                      <span className="fw-semibold">Degree:</span> {doctor.doctor_degree || "Not Degree"}
                    </p>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => window.open(`/PreferredDoctor/${doctor.id}`, "_blank")}
                    >
                      Know More
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="d-flex flex-column justify-content-center align-items-center mb-3">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <h5>No Doctors Available</h5>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}