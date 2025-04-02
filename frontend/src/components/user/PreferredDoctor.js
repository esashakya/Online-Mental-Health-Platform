import { useParams } from "react-router-dom";
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";

export default function PreferredDoctor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const { authTokens, user } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [error, setError] = useState(""); 
  const [rating, setRating] = useState(1); // Adding a rating
  const accessToken = authTokens?.access;

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/doctors/${id}`);
        const data = await response.json();
        setDoctor(data);

        const reviewsResponse = await fetch(
          `http://127.0.0.1:8000/api/get/reviews/`
        );
        const reviewsData = await reviewsResponse.json();
        console.log(reviewsData); 
        console.log("Doctor ID from URL:", id);
        const filteredReviews = reviewsData.results.filter(review => {
          return review.therapist_id === parseInt(id);  
        });
        console.log(filteredReviews);
        setReviews(filteredReviews); 
        
      } catch (error) {
        console.error("Error fetching doctor details or reviews:", error);
      }
    };

    fetchDoctorDetails();
  }, [id]);

  const handleReview = async () => {
    if (newReview.trim() !== "") {
      if (newReview.trim().length < 10) {
        setError("Review must be at least 10 characters long.");
        return;
      }
      setError(""); 
      const reviewData = {
        review_post: newReview,
        doctor_ratings: rating,
        therapist_id: id,
      };
      console.log(reviewData);
      console.log(accessToken);

      try {
        const response = await fetch("http://127.0.0.1:8000/api/add/reviews/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(reviewData),
        });

        if (response.ok) {
          const newReview = await response.json();
          console.log(newReview);
          setReviews([...reviews, newReview]);
          setNewReview("");
        } else {
          console.error("Failed to submit review");
        }
      } catch (error) {
        console.error("Error submitting review:", error);
      }
    }
  };
  const renderStars = (rating) => {
    const filledStars = Array(rating).fill("bi-star-fill");
    const emptyStars = Array(5 - rating).fill("bi-star");

    const allStars = [...filledStars, ...emptyStars];

    return allStars.map((star, index) => (
      <i
        key={index}
        className={`bi ${star} text-warning`}
        style={{ fontSize: "1.5em" }}
      ></i>
    ));
  };
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
              <h2 className="text-primary fw-bold">
                {doctor.user.user_fullname}
              </h2>
              <p className="text-muted">
                {doctor.doctor_type === 1
                  ? "Therapist"
                  : doctor.doctor_type === 2
                  ? "Psychiatrist"
                  : "Unknown"}
              </p>
              <hr />
              <p>
                <strong>Experience:</strong> 10+ years
              </p>
              <p>
                <strong>Specialization:</strong> {doctor.doctor_degree}
              </p>
              <p>
                <strong>Available Time:</strong>{" "}
                {doctor.doctor_availableStartTime || "Not Available"} -{" "}
                {doctor.doctor_availableEndTime || "Not Available"}
              </p>
              <p>
                <strong>Contact:</strong>
                {doctor.user.user_email}
              </p>
              <button
                className="btn btn-primary mt-2"
                onClick={() => navigate(`/BookAppointment/${doctor.id}`)}
              >
                Book Appointment
              </button>
            </div>
          </div>
        </div>

        <div
          className="card shadow-lg p-4 mt-4"
          style={{ backgroundColor: "#E3F2FD", borderRadius: "15px" }}
        >
          <h4 className="text-primary">Patient Reviews</h4>
          <ul className="list-group list-group-flush">
            {reviews.length > 0 ? (
              reviews.map((review, index) => (
                <li
                  key={index}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div className="d-flex flex-grow-1">
                    <p className="mb-1 me-3">{review.review_post}</p>
                    <div className="ms-auto">
                      {renderStars(review.doctor_ratings)}
                    </div>
                  </div>
                </li>
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
            {error && (
              <p
                className="text-danger text-center mt-2"
                style={{ fontSize: "0.85em" }} 
              >
                {error}
              </p>
            )}
            <div className="mt-2">
              <label>Rating:</label>
              <select
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="form-select"
                style={{
                  borderRadius: "10px",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                }}
              >
                <option value={1}>1 - Poor</option>
                <option value={2}>2 - Fair</option>
                <option value={3}>3 - Good</option>
                <option value={4}>4 - Very Good</option>
                <option value={5}>5 - Excellent</option>
              </select>
            </div>
            <button className="btn btn-primary mt-2" onClick={handleReview}  >
              Submit Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
