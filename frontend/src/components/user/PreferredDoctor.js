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
  const [rating, setRating] = useState(1);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const accessToken = authTokens?.access;

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

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/get/reviews/");
        const reviewsData = await response.json();

        const reviewsWithUserNames = await Promise.all(
          reviewsData.results.map(async (review) => {
            const userResponse = await fetch(
              `http://127.0.0.1:8000/api/get/user/${review.user_id}`
            );
            const userData = await userResponse.json();

            return {
              ...review,
              user_fullname: userData.user_fullname,
            };
          })
        );

        const filteredReviews = reviewsWithUserNames.filter((review) => {
          return review.therapist_id === parseInt(id);
        });

        setReviews(filteredReviews);
      } catch (error) {
        setError("Error fetching reviews or user data");
        console.error("Error:", error);
      }
    };

    fetchReviews();
  }, [id]);
  const checkSlotAvailability = async (therapistId, slotDateTime) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/appointments/check_availability/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            therapist_id: therapistId,
            appointment_date: slotDateTime.toISOString(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to check availability");
      }

      const data = await response.json();
      return data.available;
    } catch (error) {
      console.error("Error checking availability:", error);
      return false;
    }
  };
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
        user_id: user.user_id,
      };

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
          const newReviewData = await response.json();
          setReviews([
            ...reviews,
            {
              ...newReviewData,
              user_fullname: user.user_fullname,
            },
          ]);
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
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <i
          key={i}
          className={`bi ${
            i < rating ? "bi-star-fill" : "bi-star"
          } text-warning`}
          style={{ fontSize: "1.5em" }}
        ></i>
      ));
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours, 10);
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${period}`;
  };

  const handleBookAppointment = async () => {
    if (!selectedSlot) {
      alert("Please select a time slot first");
      return;
    }

    // Combine the selected date with the time slot
    const today = new Date();
    const slotDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      parseInt(selectedSlot.start_time.split(":")[0]),
      parseInt(selectedSlot.start_time.split(":")[1])
    );

    

    navigate(`/BookAppointment/${doctor.id}`, {
      state: {
        slotId: selectedSlot.id,
        startTime: selectedSlot.start_time,
        endTime: selectedSlot.end_time,
      },
    });
  };
 
  
  if (!doctor)
    return (
      <div className="d-flex flex-column justify-content-center align-items-center mb-3">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );

  return (
    <div className="container my-5">
      <div className="card shadow-lg mb-4" style={{ overflow: "hidden" }}>
        <div className="row g-0">
          <div className="col-md-4 d-flex align-items-center justify-content-center p-4 bg-light">
            <img
              src={`http://localhost:8000${doctor.doctor_photo}`}
              alt="Doctor"
              className="img-fluid rounded-circle border border-3 "
            />
          </div>
          <div className="col-md-8">
            <div className="card-body p-4">
              <h2 className="card-title text-primary mb-3">
                {doctor.user.user_fullname}
              </h2>
              <div className="badge bg-info text-dark fs-6 mb-3">
                {doctor.doctor_type === 1 ? "Therapist" : "Psychiatrist"}
              </div>

              <div className="d-flex align-items-center mb-2">
                <i className="bi bi-award-fill text-secondary me-2"></i>
                <span className="fw-semibold">Specialization:</span>
                <span className="ms-2">{doctor.doctor_degree}</span>
              </div>

              <div className="d-flex align-items-center mb-2">
                <i className="bi bi-envelope-fill text-secondary me-2"></i>
                <span className="fw-semibold">Email:</span>
                <span className="ms-2">{doctor.user.user_email}</span>
              </div>

              <div className="mt-4">
                <h5 className="text-primary mb-3">Availability</h5>
                <div className="d-flex flex-wrap gap-2">
                  {doctor.time_slots && doctor.time_slots.length > 0 ? (
                    doctor.time_slots.map((slot, index) => (
                      <button
                        key={slot.id}
                        className={`btn ${
                          selectedSlot?.id === slot.id
                            ? "btn-primary"
                            : "btn-outline-primary"
                        } rounded-pill`}
                        onClick={() => setSelectedSlot(slot)}
                      >
                        {formatTime(slot.start_time)} -{" "}
                        {formatTime(slot.end_time)}
                      </button>
                    ))
                  ) : (
                    <p className="text-muted">No available time slots</p>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <button
                  className="btn btn-primary px-4 py-2 rounded-pill"
                  onClick={handleBookAppointment}
                  disabled={!selectedSlot || doctor.doctor_status !== 1}
                >
                  <i className="bi bi-calendar-check me-2"></i>
                  Book Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-lg p-4" style={{ borderRadius: "15px" }}>
        <h4 className="text-primary mb-1">Patient Reviews</h4>
        <div className="mt-4">
          <h5 className="text-primary mb-3">Add Your Review</h5>
          <div className="mb-3">
            <label className="form-label">Rating</label>
            <div className="d-flex align-items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <i
                  key={star}
                  className={`bi ${
                    star <= rating ? "bi-star-fill" : "bi-star"
                  } text-warning me-1`}
                  style={{ fontSize: "1.5em", cursor: "pointer" }}
                  onClick={() => setRating(star)}
                ></i>
              ))}
              <span className="ms-2 text-muted">{rating} out of 5</span>
            </div>
          </div>
          <div className="mb-3">
            <textarea
              className="form-control"
              rows="4"
              placeholder="Share your experience with this doctor..."
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
            ></textarea>
            {error && <div className="text-danger small mt-1">{error}</div>}
          </div>
          <button
            className="btn btn-primary px-4 py-2 rounded-pill mb-2"
            onClick={handleReview}
            disabled={!newReview.trim()}
          >
            Submit Review
          </button>
        </div>
        {reviews.length > 0 ? (
          <div className="row g-3">
            {reviews.map((review, index) => (
              <div key={index} className="col-12">
                <div className="card p-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-person-circle me-2 fs-4 text-secondary"></i>
                      <span className="fw-semibold">
                        {review.user_fullname || "Anonymous"}
                      </span>
                    </div>
                    <div>{renderStars(review.doctor_ratings)}</div>
                  </div>
                  <p className="mb-0">{review.review_post}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <i className="bi bi-chat-square-text fs-1 text-muted"></i>
            <p className="text-muted mt-2">
              No reviews yet. Be the first to review!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
