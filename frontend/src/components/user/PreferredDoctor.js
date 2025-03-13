import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PreferredDoctor() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");

  const handleReview = () => {
    if (newReview.trim() !== "") {
      setReviews([...reviews, newReview]);
      setNewReview("");
    }
  };
  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/doctors/${id}`);
        const data = await response.json();
        console.log(id);
        setDoctor(data);
      } catch (error) {
        console.error("Error fetching doctor details:", error);
        console.log(id);
      }
    };

    fetchDoctorDetails();
  }, [id]);
  if (!doctor) return <h2>Loading doctor details...</h2>;
  return (
    <div>
      <div className="container mt-5">
          <div
            className="card shadow-lg p-4"
            style={{ backgroundColor: "#E3F2FD", borderRadius: "15px" }}
          >
            <div className="row">
              <div className="col-md-4 mb-3 d-flex justify-content-center align-items-center">
                <img
                  src={`http://localhost:8000${doctor.doctor_photo}`} 
                  alt="Doctor image"
                  className="rounded img-fluid border"
                />
              </div>
              <div className="col-md-8">
                <h2 className="text-primary fw-bold">{doctor.user.user_fullname}</h2>
                <p className="text-muted">{doctor.doctor_type === 1 ? "Therapist" : doctor.doctor_type === 2 ? "Psychiatrist" : "Unknown"}</p>
                <hr />
                <p>
                  <strong>Experience:</strong> 10+ years
                </p>
                <p>
                  <strong>Specialization:</strong> {doctor.doctor_degree}
                </p>
                <p>
                  <strong>Available Time:</strong> {doctor.doctor_availableTime}
                </p>
                <p>
                  <strong>Contact:</strong>{doctor.user.user_email}
                </p>
                <button className="btn btn-primary mt-2" onClick={() => navigate(`/BookAppointment/${doctor.id}`)}>
                  Book Appointment
                </button>
              </div>
            </div>
          </div>
          <div className="card shadow-lg p-4 mt-4" style={{ backgroundColor: "#E3F2FD", borderRadius: "15px" }}>
        <h4 className="text-primary">Patient Reviews</h4>
        <ul className="list-group list-group-flush">
          {reviews.length > 0 ? (
            reviews.map((review, index) => (
              <li key={index} className="list-group-item">{review}</li>
            ))
          ) : (
            <p className="text-muted mt-2">No reviews yet...</p>
          )}
        </ul>
        <div className="mt-3">
          <textarea
            className="form-control"
            rows="3"
            placeholder="Enter your review"
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
          ></textarea>
          <button className="btn btn-primary mt-2" onClick={handleReview}>Submit Review</button>
        </div>
      </div>
        </div>
        
    </div>
  )
}
