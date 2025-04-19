import React, { useState, useEffect } from "react";
import useAxios from "../../utils/useAxios";
import SearchBar from "../user/SearchBar";
import { format } from "date-fns";
const msg = require("sweetalert2");

export default function AdminReviews() {
  const apiAxios = useAxios();
  const [reviews, setReviews] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [presentPage, setPresentPage] = useState(1);
  const [dataPerPage] = useState(5);
  const [selectedReview, setSelectedReview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Search filtering
  const filteredReviews = reviews.filter((review) =>
    (review.review_post || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (review.user_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (review.therapist_name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination
  const indexOfLast = presentPage * dataPerPage;
  const indexOfFirst = indexOfLast - dataPerPage;
  const currentData = filteredReviews.slice(indexOfFirst, indexOfLast);

  const nextPage = () => {
    if (presentPage < Math.ceil(filteredReviews.length / dataPerPage)) {
      setPresentPage(presentPage + 1);
    }
  };

  const prevPage = () => {
    if (presentPage > 1) {
      setPresentPage(presentPage - 1);
    }
  };

  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true);
      try {
        const response = await apiAxios.get("/get/reviews/");
        setReviews(response.data.results);  // Assumes paginated response
      } catch (error) {
        console.error("Failed to fetch reviews", error);
        msg.fire({
          title: "Error!",
          text: "Unable to load reviews.",
          icon: "error",
          timer: 3000,
          timerProgressBar: true
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const handleDeleteReview = async (pk) => {
    try {
      await msg.fire({
        title: "Are you sure?",
        text: "You won't be able to get back your data after this action.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Okay",
      
      }).then(async (result) => {
        if (result.isConfirmed) {
          await apiAxios.delete(`/admin/delete/review/${pk}/`);
          setReviews((prev) => prev.filter((r) => r.id !== pk));
          msg.fire("Deleted!", "Review has been deleted.", "success");
        }
      });
    } catch (error) {
      console.error("Delete error:", error);
      msg.fire("Error!", "Failed to delete review.", "error");
    }
  };

  const handleViewReview = (review) => {
    setSelectedReview(review);
    const modal = new window.bootstrap.Modal(document.getElementById("reviewDetailsModal"));
    modal.show();
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy hh:mm a");
    } catch {
      return dateString;
    }
  };

  return (
    <div className="container my-4 p-4 bg-light rounded shadow-sm">
      <SearchBar 
        searchQuery={searchQuery} 
        onSearchChange={(e) => {
          setSearchQuery(e.target.value);
          setPresentPage(1);
        }} 
      />

      <div className="d-flex justify-content-between align-items-center mt-4">
        <h4 className="text-primary fw-semibold">
         
         All Reviews 
        </h4>
      </div>
      <hr className="border-primary opacity-25" />

      {isLoading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
          <p className="mt-2">Loading reviews...</p>
        </div>
      ) : (
        <div className="table-responsive mt-4">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-primary text-white">
              <tr>
                <th>ID</th>
                <th>Review</th>
                <th>Rating</th>
                <th>User</th>
                <th>Therapist</th>
                <th>Date</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((review) => (
                <tr key={review.id}>
                  <td>{review.id}</td>
                  <td className="text-truncate" style={{ maxWidth: '200px' }}>
                    {review.review_post.length > 50 ? review.review_post.substring(0, 50) + "..." : review.review_post}
                  </td>
                  <td>{review.doctor_ratings} / 5</td>
                  <td>{review.user_name || "Anonymous"}</td>
                  <td>{review.therapist_name}</td>
                  <td>{formatDate(review.review_date)}</td>
                  <td className="text-center">
                    <div className="d-flex justify-content-center gap-2">
                      <button className="btn btn-sm btn-outline-primary" onClick={() => handleViewReview(review)}>
                        <i className="bi bi-eye"></i>
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteReview(review.id)}>
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {currentData.length === 0 && (
            <div className="text-center py-4 text-muted">
              <i className="bi bi-star me-3" style={{ fontSize: '2rem' }}></i>
              <p className="mt-2">No reviews found</p>
            </div>
          )}

          {filteredReviews.length > dataPerPage && (
            <nav className="float-end mt-3">
              <ul className="pagination">
                <li className={`page-item ${presentPage === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={prevPage}><i className="bi bi-chevron-left"></i></button>
                </li>
                <li className={`page-item ${presentPage === Math.ceil(filteredReviews.length / dataPerPage) ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={nextPage}><i className="bi bi-chevron-right"></i></button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      )}

      {/* Review Details Modal */}
      <div className="modal fade" id="reviewDetailsModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content border-0 shadow">
            <div className="modal-header bg-info text-dark">
              <h5 className="modal-title">
                <i className="bi bi-star-fill me-2"></i> Review Details
              </h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {selectedReview && (
                <>
                  <p><strong>User:</strong> {selectedReview.user_name}</p>
                  <p><strong>Therapist:</strong> {selectedReview.therapist_name}</p>
                  <p><strong>Date:</strong> {formatDate(selectedReview.review_date)}</p>
                  <p><strong>Rating:</strong> {selectedReview.doctor_ratings} / 5</p>
                  <hr />
                  <p><strong>Review:</strong></p>
                  <p style={{ whiteSpace: 'pre-line' }}>{selectedReview.review_post}</p>
                </>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
