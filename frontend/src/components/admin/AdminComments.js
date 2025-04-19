import React, { useState, useEffect } from "react";
import SearchBar from "../user/SearchBar";
import useAxios from "../../utils/useAxios";
import { format } from 'date-fns';
const msg = require("sweetalert2");

export default function AdminComments() {
  const apiAxios = useAxios();
  const [comments, setComments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [presentPage, setPresentPage] = useState(1);
  const [dataPerPage] = useState(5);
  const [selectedComment, setSelectedComment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Filter comments based on search query
  const filteredComments = comments.filter(
    (comment) =>
      comment.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (comment.user_email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (comment.comment_category || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const indexOfLastData = presentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;
  const currentData = filteredComments.slice(indexOfFirstData, indexOfLastData);

  const nextPage = () => {
    if (presentPage < Math.ceil(filteredComments.length / dataPerPage)) {
      setPresentPage(presentPage + 1);
    }
  };
  const prevPage = () => {
    if (presentPage > 1) {
      setPresentPage(presentPage - 1);
    }
  };

  useEffect(() => {
    const fetchComments = async () => {
      setIsLoading(true);
      try {
        console.log("Fetching comments...");
        const response = await apiAxios.get("/comments/?admin=True");
        console.log("Comments API response:", response.data);
        setComments(response.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
        console.error("Error details:", error.response ? error.response.data : 'No response data');
        msg.fire({
          title: "Error!",
          text: "Failed to load comments. Please try again later.",
          icon: "error",
          timer: 3000,
          timerProgressBar: true,
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchComments();
  }, []);

  const handleDeleteBtn = async (pk) => {
    console.log(pk);
    try {
      await msg.fire({
        title: 'Are you sure?',
        text: "You won't be able to get back your data after this action.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Okay'
      }).then(async (result) => {
        if (result.isConfirmed) {
          await apiAxios.delete(`/comments/${pk}/`);
          
          msg.fire({
            title: "Deleted!",
            text: "comment has been deleted successfully",
            icon: "success",
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false
          });
          
          setComments((prev) => prev.filter((comment) => comment.id !== pk));
        }
      });
    } catch (error) {
      console.error("Error deleting comment:", error);
      msg.fire({
        title: "Error!",
        text: "Failed to delete comment.",
        icon: "error",
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false
      });
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy hh:mm a');
    } catch {
      return dateString;
    }
  };

  const handleViewComment = (comment) => {
    setSelectedComment(comment);
    const modal = new window.bootstrap.Modal(document.getElementById('commentDetailsModal'));
    modal.show();
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
       
          All Comments 
        </h4>
      </div>
      <hr className="border-primary opacity-25" />

      {isLoading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading comments...</p>
        </div>
      ) : (
        <div className="table-responsive mt-4">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-primary text-white">
              <tr>
                
                <th>ID</th>
                <th>Content</th>
                <th>Type</th>
                <th>Date</th>
                <th>Author</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((comment, index) => (
                <tr key={comment.id}>
               
                  <td>{comment.id}</td>
                  <td className="text-truncate" style={{ maxWidth: '200px' }}>
                    {comment.content.substring(0, 50)}{comment.content.length > 50 ? '...' : ''}
                  </td>
                  <td>
                    <span className={`badge ${comment.comment_category === 'Blog' ? 'bg-info' : 'bg-warning'}`}>
                      {comment.comment_category}
                    </span>
                  </td>
                  <td>{formatDate(comment.created_at)}</td>
                  <td>{comment.user_fullname || 'Anonymous'}</td>
                  <td className="text-center">
                    <div className="d-flex justify-content-center gap-2">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleViewComment(comment)}
                        title="View details"
                      >
                        <i className="bi bi-eye"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDeleteBtn(comment.id)}
                        title="Delete comment"
                      >
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
              <i className="bi bi-chat-square me-3" style={{ fontSize: '2rem' }}></i>
              <p className="mt-2">No comments found</p>
            </div>
          )}

          {filteredComments.length > dataPerPage && (
            <nav aria-label="Comments pagination">
              <ul className="pagination float-end mt-3">
                <li className={`page-item ${presentPage === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={prevPage}>
                    <i className="bi bi-chevron-left"></i>
                  </button>
                </li>
                
                <li className={`page-item ${presentPage === Math.ceil(filteredComments.length / dataPerPage) ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={nextPage}>
                    <i className="bi bi-chevron-right"></i>
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      )}

   
      <div className="modal fade" id="commentDetailsModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content border-0 shadow">
            <div className="modal-header bg-info text-dark">
              <h5 className="modal-title">
                <i className="bi bi-chat-left-text me-2"></i>
                Comment Details
              </h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {selectedComment && (
                <>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <div className="d-flex gap-3 text-muted small mt-2">
                        <span>
                          <i className="bi bi-person me-1"></i>
                          {selectedComment.user_email || 'Anonymous'}
                        </span>
                        <span>
                          <i className="bi bi-tag me-1"></i>
                          {selectedComment.comment_category}
                        </span>
                        <span className="ms-auto">
                          <i className="bi bi-clock me-1"></i>
                          {formatDate(selectedComment.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded p-3 bg-light">
                    <h5 className="text-primary mb-3">Content:</h5>
                    <p className="mb-0" style={{ whiteSpace: 'pre-line' }}>
                      {selectedComment.content}
                    </p>
                  </div>

                  {selectedComment.blog && (
                    <div className="mt-3">
                      <h6 className="text-muted">Posted on Blog:</h6>
                      <p className="fw-bold">{selectedComment.blog.title}</p>
                    </div>
                  )}

                  {selectedComment.forum && (
                    <div className="mt-3">
                      <h6 className="text-muted">Posted on Forum:</h6>
                      <p className="fw-bold">{selectedComment.forum.post_title}</p>
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}