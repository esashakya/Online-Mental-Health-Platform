import React, { useState, useEffect } from "react";
import SearchBar from "../user/SearchBar";
import useAxios from "../../utils/useAxios";
import { format } from 'date-fns';
const msg = require("sweetalert2");

export default function AdminForum() {
  const apiAxios = useAxios();
  const [posts, setPost] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [presentPage, setPresentPage] = useState(1);
  const [dataPerPage] = useState(5);
  const [selectedPost, setSelectedPost] = useState(null);

  // Filter posts based on search query
  const filteredPosts = posts.filter(
    (post) =>
      post.post_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.post_detail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.user_id?.toString().includes(searchQuery)
  );

  // Pagination logic
  const indexOfLastData = presentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;
  const currentData = filteredPosts.slice(indexOfFirstData, indexOfLastData);

  const paginate = (pageNumber) => setPresentPage(pageNumber);
  const nextPage = () => {
    if (presentPage < Math.ceil(filteredPosts.length / dataPerPage)) {
      setPresentPage(presentPage + 1);
    }
  };
  const prevPage = () => {
    if (presentPage > 1) {
      setPresentPage(presentPage - 1);
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await apiAxios.get("/forum/");
        setPost(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, []);

  const handleDeleteBtn = async (pk) => {
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
          await apiAxios.delete(`/forum/${pk}/`);
          
          msg.fire({
            title: "Deleted!",
            text: "The post has been deleted.",
            icon: "success",
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false
          });
          
          setPost((prev) => prev.filter((post) => post.id !== pk));
        }
      });
    } catch (error) {
      console.error("Error deleting post:", error);
      msg.fire({
        title: "Error!",
        text: "Failed to delete post.",
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

  const handleViewPost = (post) => {
    setSelectedPost(post);
    // Show the modal using Bootstrap's JavaScript API
    const modal = new window.bootstrap.Modal(document.getElementById('postDetailsModal'));
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
          <i className="bi bi-chat-square-text me-2"></i>
          Forum Posts Management
        </h4>
       
      </div>
      <hr className="border-primary opacity-25" />

      <div className="table-responsive mt-4">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-primary text-white">
            <tr>
              <th>#</th>
              <th>ID</th>
              <th>Title</th>
              <th>Preview</th>
              <th>Date</th>
              <th>Anonymous</th>
              <th>Author</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((post, index) => (
              <tr key={post.id}>
                <td>{indexOfFirstData + index + 1}</td>
                <td>{post.id}</td>
                <td className="text-truncate" style={{ maxWidth: '150px' }}>
                  {post.post_title}
                </td>
                <td className="text-truncate" style={{ maxWidth: '200px' }}>
                  {post.post_detail.substring(0, 50)}{post.post_detail.length > 50 ? '...' : ''}
                </td>
                <td>{formatDate(post.post_date)}</td>
                <td>
                  <span className={`badge ${post.anonymous ? 'bg-info' : 'bg-secondary'}`}>
                    {post.anonymous ? "Yes" : "No"}
                  </span>
                </td>
                <td>{post.user_id}</td>
                <td className="text-center">
                  <div className="d-flex justify-content-center gap-2">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => handleViewPost(post)}
                      title="View details"
                    >
                      <i className="bi bi-eye"></i>
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDeleteBtn(post.id)}
                      title="Delete post"
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
          
            <p className="mt-2">Nothing found</p>
          </div>
        )}

        
        {filteredPosts.length > dataPerPage && (
          <nav aria-label="Forum posts pagination">
            <ul className="pagination justify-content-center mt-3">
              <li className={`page-item ${presentPage === 1 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={prevPage}>
                  <i className="bi bi-chevron-left"></i>
                </button>
              </li>
              
              <li className={`page-item ${presentPage === Math.ceil(filteredPosts.length / dataPerPage) ? 'disabled' : ''}`}>
                <button className="page-link" onClick={nextPage}>
                  <i className="bi bi-chevron-right"></i>
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>

      {/*  Details Modal */}
      <div className="modal fade" id="postDetailsModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content border-0 shadow">
            <div className="modal-header bg-info text-dark">
              <h5 className="modal-title">
                <i className="bi bi-chat-square-text me-2"></i>
                Post Details
              </h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {selectedPost && (
                <>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h4 className="fw-bold mb-1">{selectedPost.post_title}</h4>
                      <div className="d-flex gap-3 text-muted small mt-2">
                        <span>
                         
                          User ID: {selectedPost.user_id}
                        </span>
                        <span className="ms-auto">
                          
                          {formatDate(selectedPost.post_date)}
                        </span>
                        
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded p-3 bg-light">
                    <h5 className="text-primary mb-3">Content:</h5>
                    <p className="mb-0" style={{ whiteSpace: 'pre-line' }}>
                      {selectedPost.post_detail}
                    </p>
                  </div>
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