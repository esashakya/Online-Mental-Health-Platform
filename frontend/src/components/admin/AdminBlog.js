import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../../context/AuthContext";
import SearchBar from "../user/SearchBar";
import { format } from 'date-fns';
const msg = require("sweetalert2");

export default function AdminBlog() {
  const [blogs, setBlog] = useState([]);
  const [editId, setEditId] = useState(null);
  const { addNewBlog } = useContext(AuthContext);
  const [doctors, setDoctor] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [presentPage, setPresentPage] = useState(1);
  const [dataPerPage] = useState(5);
  const [selectedBlog, setSelectedBlog] = useState(null);

  const [newData, setNewData] = useState({
    blog_image: "",
    blog_title: "",
    blog_detail: "",
    blog_date: "",
    therapist_id: "",
    blog_category: "",
  });

  // Filter blogs based on search query
  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.blog_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.blog_detail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.therapist_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.blog_category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const indexOfLastData = presentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;
  const currentData = filteredBlogs.slice(indexOfFirstData, indexOfLastData);

  const paginate = (pageNumber) => setPresentPage(pageNumber);
  const nextPage = () => {
    if (presentPage < Math.ceil(filteredBlogs.length / dataPerPage)) {
      setPresentPage(presentPage + 1);
    }
  };
  const prevPage = () => {
    if (presentPage > 1) {
      setPresentPage(presentPage - 1);
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  const handleViewBlog = (blog) => {
    setSelectedBlog(blog);
    const modal = new window.bootstrap.Modal(document.getElementById('blogDetailsModal'));
    modal.show();
  };

  const handleEditBtn = (blog) => {
    setEditId(blog.id);
    setNewData({
      blog_image: blog.blog_image || "",
      blog_title: blog.blog_title || "",
      blog_detail: blog.blog_detail || "",
      blog_date: blog.blog_date || "",
      therapist_id: blog.therapist_id || "",
      blog_category: blog.blog_category || "",
    });
  };

  const handleEdit = (e) => {
    const { name, value } = e.target;
    setNewData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditBlog = async (e, blogId) => {
    e.preventDefault();

    const updatedData = new FormData();
    const currentBlog = blogs.find((blog) => blog.id === blogId);

    if (newData.blog_title !== currentBlog?.blog_title) {
      updatedData.append("blog_title", newData.blog_title);
    }
    if (newData.blog_detail !== currentBlog?.blog_detail) {
      updatedData.append("blog_detail", newData.blog_detail);
    }
    if (newData.blog_image !== currentBlog?.blog_image) {
      updatedData.append("blog_image", newData.blog_image);
    }
    if (newData.therapist_id !== currentBlog?.therapist_id) {
      updatedData.append("therapist_id", newData.therapist_id);
    }
    if (newData.blog_category !== currentBlog?.blog_category) {
      updatedData.append("blog_category", newData.blog_category);
    }

    if (
      updatedData.has("blog_title") ||
      updatedData.has("blog_detail") ||
      updatedData.has("blog_image") ||
      updatedData.has("therapist_id") ||
      updatedData.has("blog_category")
    ) {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/blogs/${blogId}`,
          {
            method: "PUT",
            body: updatedData,
          }
        );

        const data = await response.json();
        if (!response.ok) {
          console.error("Update fail:", data);
          msg.fire({
            title: "Update Failed",
            text: "Please check your inputs and try again",
            icon: "error",
            timer: 3000
          });
        } else {
          msg.fire({
            title: "Success!",
            text: "Blog post updated successfully",
            icon: "success",
            timer: 3000
          });
          window.location.reload();
        }
      } catch (error) {
        console.error("Error while editing:", error);
      }
    } else {
      msg.fire({
        title: "No Changes",
        text: "You haven't made any changes to save",
        icon: "info",
        timer: 3000
      });
    }
  };

  const handleNewBlog = async (e) => {
    e.preventDefault();

    const blog_title = e.target.blogTitle.value;
    const blog_detail = e.target.blogDetail.value;
    const therapist_id = e.target.therapist_id.value;
    const blog_category = e.target.blog_category.value;
    const blog_image = e.target.blogImage.files[0];

    if (!blog_title || !blog_detail || !therapist_id || !blog_category || !blog_image) {
      msg.fire({
        title: "Missing Fields",
        text: "Please fill all required fields",
        icon: "error",
        timer: 3000
      });
      return;
    }

    const formData = new FormData();
    formData.append("blog_title", blog_title);
    formData.append("blog_detail", blog_detail);
    formData.append("therapist_id", therapist_id);
    formData.append("blog_image", blog_image);
    formData.append("blog_category", blog_category);

    try {
      const response =await addNewBlog(formData);
      if(response){
      msg.fire({
        title: "Success!",
        text: "Blog post created successfully",
        icon: "success",
        timer: 6000
      });}
   
    } catch (error) {
      console.error("Error creating blog:", error);
    }
  };

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/blogs/");
        const data = await response.json();
        setBlog(data);
      } catch (error) {
        console.error("error due to:", error);
        setBlog([]);
      }
    };
    const fetchDoctor = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/doctors/"); 
        const data = await response.json();
        setDoctor(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchBlogs();
    fetchDoctor();
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
          const response = await fetch(`http://127.0.0.1:8000/api/blogs/${pk}`, {
            method: "DELETE",
          });

          if (!response.ok) {
            throw new Error(`Error while deleting: ${response.status}`);
          }
          
          msg.fire({
            title: "Deleted!",
            text: "The blog post has been deleted.",
            icon: "success",
            timer: 3000
          });
          
          setBlog((prev) => prev.filter((blog) => blog.id !== pk));
        }
      });
    } catch (error) {
      console.error("Error:", error);
      msg.fire({
        title: "Error!",
        text: "Failed to delete blog post.",
        icon: "error",
        timer: 3000
      });
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
          
          All Blogs 
        </h4>
        
      </div>
      <hr className="border-primary opacity-25" />

      <div className="d-flex justify-content-end mb-3">
        <button
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#staticBackdrop"
        >
       
          Add New Blog Post
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-primary text-white">
            <tr>
              
              <th>Title</th>
              <th>Preview</th>
              <th>Image</th>
              <th>Date</th>
              <th>Category</th>
              <th>Therapist</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((blog, index) => (
              <tr key={blog.id}>
                
                <td className="fw-semibold">{blog.blog_title}</td>
                <td className="text-truncate" style={{ maxWidth: '200px' }}>
                  {blog.blog_detail.substring(0, 60)}{blog.blog_detail.length > 60 ? '...' : ''}
                </td>
                <td>
                  {blog.blog_image && (
                    <img 
                      src={`http://127.0.0.1:8000${blog.blog_image}`} 
                      alt="Blog thumbnail" 
                      className="img-thumbnail" 
                      style={{ width: '80px', height: '60px', objectFit: 'cover' }}
                    />
                  )}
                </td>
                <td>{formatDate(blog.blog_date)}</td>
                <td>
                  <span className="badge bg-info">{blog.blog_category}</span>
                </td>
                <td>{blog.therapist_name}</td>
                <td className="text-center">
                  <div className="d-flex justify-content-center gap-2">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => handleViewBlog(blog)}
                      title="View details"
                    >
                      <i className="bi bi-eye"></i>
                    </button>
                    <button
                      className="btn btn-sm btn-outline-success"
                      onClick={() => handleEditBtn(blog)}
                      data-bs-toggle="modal"
                      data-bs-target="#editBlogModal"
                      title="Edit post"
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDeleteBtn(blog.id)}
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
            <i className="bi bi-info-circle fs-1"></i>
            <p className="mt-2">No blog posts found matching your criteria</p>
          </div>
        )}

        {/* Pagination */}
        {filteredBlogs.length > dataPerPage && (
          <nav aria-label="Blog posts pagination">
            <ul className="pagination justify-content-center mt-3">
              <li className={`page-item ${presentPage === 1 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={prevPage}>
                  <i className="bi bi-chevron-left"></i>
                </button>
              </li>
             
              <li className={`page-item ${presentPage === Math.ceil(filteredBlogs.length / dataPerPage) ? 'disabled' : ''}`}>
                <button className="page-link" onClick={nextPage}>
                  <i className="bi bi-chevron-right"></i>
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>

      {/* Blog Details Modal */}
      <div className="modal fade" id="blogDetailsModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content border-0 shadow">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title">
                <i className="bi bi-journal-text me-2"></i>
                Blog Post Details
              </h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {selectedBlog && (
                <>
                  <div className="text-center mb-4">
                    {selectedBlog.blog_image && (
                      <img 
                        src={`http://127.0.0.1:8000${selectedBlog.blog_image}`} 
                        alt="Blog header" 
                        className="img-fluid rounded mb-3"
                        style={{ maxHeight: '300px' }}
                      />
                    )}
                    <h3 className="fw-bold">{selectedBlog.blog_title}</h3>
                    <div className="d-flex justify-content-center gap-3 text-muted small mt-2">
                      <span>
                        <i className="bi bi-person me-1"></i>
                        {selectedBlog.therapist_name}
                      </span>
                      <span>
                        <i className="bi bi-calendar me-1"></i>
                        {formatDate(selectedBlog.blog_date)}
                      </span>
                      <span className="badge bg-info">
                        {selectedBlog.blog_category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="border-top pt-3">
                    <div className="blog-content" style={{ whiteSpace: 'pre-line' }}>
                      {selectedBlog.blog_detail}
                    </div>
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

      {/* Add New Blog Modal */}
      <div className="modal fade" id="staticBackdrop" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content border-0 shadow">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title">
               
                Create New Blog Post
              </h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleNewBlog}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Blog Title</label>
                      <input
                        type="text"
                        className="form-control"
                        name="blogTitle"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Category</label>
                      <select
                        className="form-select"
                        name="blog_category"
                        required
                      >
                        <option value="">Select Category</option>
                        {["Anxiety", "Depression", "OCD", "Sleep Paralysis"].map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Therapist</label>
                      <select
                        className="form-select"
                        name="therapist_id"
                        required
                      >
                        <option value="">Select Therapist</option>
                        {doctors.map((doctor) => (
                          <option key={doctor.id} value={doctor.id}>
                            {doctor.user?.user_fullname}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Featured Image </label>
                      <input
                        type="file"
                        className="form-control"
                        name="blogImage"
                        accept="image/*"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Blog Content </label>
                  <textarea
                    className="form-control"
                    name="blogDetail"
                    rows="6"
                    required
                  ></textarea>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Publish Post
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Blog Modal */}
      <div className="modal fade" id="editBlogModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content border-0 shadow">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title">
              
                Edit Blog 
              </h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={(e) => handleEditBlog(e, editId)}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Blog Title </label>
                      <input
                        type="text"
                        className="form-control"
                        name="blog_title"
                        value={newData.blog_title}
                        onChange={handleEdit}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Category </label>
                      <select
                        className="form-select"
                        name="blog_category"
                        value={newData.blog_category}
                        onChange={handleEdit}
                        required
                      >
                        <option value="">Select Category</option>
                        {["Anxiety", "Depression", "OCD", "Sleep Paralysis"].map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Therapist </label>
                      <select
                        className="form-select"
                        name="therapist_id"
                        value={newData.therapist_id}
                        onChange={handleEdit}
                        required
                      >
                        <option value="">Select Therapist</option>
                        {doctors.map((doctor) => (
                          <option key={doctor.id} value={doctor.id}>
                            {doctor.user?.user_fullname}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Featured Image</label>
                      <input
                        type="file"
                        className="form-control"
                        name="blog_image"
                        accept="image/*"
                        onChange={(e) =>
                          setNewData((prev) => ({
                            ...prev,
                            blog_image: e.target.files[0],
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Blog Content </label>
                  <textarea
                    className="form-control"
                    name="blog_detail"
                    rows="6"
                    value={newData.blog_detail}
                    onChange={handleEdit}
                    required
                  ></textarea>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}