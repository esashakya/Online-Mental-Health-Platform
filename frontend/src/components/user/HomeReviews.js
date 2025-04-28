import React, { useEffect, useState } from "react";

export default function HomeReviews() {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/get/reviews/");
        const data = await response.json();
        setReviews(data.results.slice(0, 3));
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating); 
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <div className="d-flex">
        {Array(fullStars)
          .fill(0)
          .map((_, i) => (
            <i
              key={`full-${i}`}
              className="bi bi-star-fill text-warning mx-1"
              style={{ fontSize: "1.2em" }}
            ></i>
          ))}
        {halfStar && (
          <i
            key="half"
            className="bi bi-star-half text-warning mx-1"
            style={{ fontSize: "1.2em" }}
          ></i>
        )}
        {Array(emptyStars)
          .fill(0)
          .map((_, i) => (
            <i
              key={`empty-${i}`}
              className="bi bi-star text-warning mx-1"
              style={{ fontSize: "1.2em" }}
            ></i>
          ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="text-center my-5 py-5">
        <div className="spinner-grow text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
          <span className="visually-hidden">Loading</span>
        </div>
      </div>
    );
  }

  return (
    <section className="py-5 bg-light">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="display-7 fw-bold ">Patient Feedbacks</h2>
          <p className="lead text-muted">Hear what our patients say about their experiences</p>
          <div className="divider mx-auto bg-primary" style={{ width: "80px", height: "4px", opacity: 0.7 }}></div>
        </div>
        
        <div className="row g-4">
          {reviews.map((review, index) => (
            <div key={review.id} className="col-md-4" data-aos="fade-up" data-aos-delay={index * 100}>
              <div className="card h-100 border-0 shadow-sm rounded-3 overflow-hidden transition-all hover-shadow">
                <div className="card-body p-4">
                  <div className="d-flex align-items-center mb-3">
                    <div className="avatar bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: "50px", height: "50px" }}>
                      <i className="bi bi-person-fill fs-4"></i>
                    </div>
                    <div className="ms-3">
                      <h5 className="mb-0 fw-semibold">{review.user_name || "Anonymous"}</h5>
                      <small className="text-muted">Patient</small>
                    </div>
                  </div>
                  <div className="mb-3">{renderStars(review.doctor_ratings)}</div>
                  <p className="text-muted mb-0">
                    "{review.review_post.length > 150
                      ? review.review_post.substring(0, 150) + "..."
                      : review.review_post}"
                  </p>
                </div>
                <div className="card-footer bg-transparent border-top-0 py-3">
                  <small className="text-muted">
                    <i className="bi bi-calendar-check me-2"></i>
                    {review.review_date}
                  </small>
                </div>
              </div>
            </div>
          ))}
        </div>

        
      </div>
    </section>
  );
}