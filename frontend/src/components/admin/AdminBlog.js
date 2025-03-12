import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../../context/AuthContext";
import SearchBar from "../user/SearchBar";
const msg = require("sweetalert2");

export default function AdminBlog() {
  const [blogs, setBlog] = useState([]);
  const [editId, setEditId] = useState(null);
  const { addNewBlog } = useContext(AuthContext);
  const [doctors, setDoctor] = useState([]);
  const [newData, setNewData] = useState({
    blog_image: "",
    blog_title: "",
    blog_detail: "",
    blog_date: "",
    therapist_id: "",
    blog_category: "",
  });
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

    // get the data of chosen blog
    const currentBlog = blogs.find((blog) => blog.id === blogId);

    // only change edited data
    if (newData.blog_title !== currentBlog?.blog_title) {
      updatedData.append("blog_title", newData.blog_title);
    }
    console.log(currentBlog?.blog_title);
    console.log(newData.blog_title);
    console.log(updatedData);
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

    // updatedData only stores the data which was edited
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
        console.log("Response status:", response.status);
        console.log("Response data:", data);
        console.log(updatedData);

        if (!response.ok) {
          console.error("Update fail:", data);
        } else {
          console.log("success:", data);
          window.location.reload();
        }
      } catch (error) {
        console.error("Error while editing:", error);
      }
    } else {
      console.log("No changes made");
    }
  };
  //add new blog
  const handleNewBlog = async (e) => {
    // Prevent page refresh
    e.preventDefault();

    const blog_title = e.target.blogTitle.value;
    const blog_detail = e.target.blogDetail.value;
    const therapist_id = e.target.therapist_id.value;
    const blog_category = e.target.blog_category.value;

    const blog_image = e.target.blogImage.files[0];

    const formData = new FormData();
    formData.append("blog_title", blog_title);
    formData.append("blog_detail", blog_detail);
    formData.append("therapist_id", therapist_id);
    formData.append("blog_image", blog_image);
    formData.append("blog_category", blog_category);

    addNewBlog(formData);
  };
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/blogs/");
        const data = await response.json();
        console.log("blogs:", data);
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
  // delete
  const handleDeleteBtn = async (pk) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/blogs/${pk}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Error while deleting: ${response.status}`);
      }
      msg.fire({
        title: "Deletion Successful",
        icon: "success",
        toast: true,
        timer: 5000,
        position: "top-right",
        timerProgressBar: true,
        showConfirmButton: false,
        background: "#28a745",
        color: "#ffffff",
        text: "Hope you have a great day!",
        didOpen: () => {
          msg.showLoading();
        },
        willClose: () => {
          msg.hideLoading();
        },
      });
      setTimeout(() => {
        window.location.reload();
      }, 5000);

      setBlog((prev) => prev.filter((blog) => blog.id !== pk));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <div>
        <div className="d-flex flex-column m-4">
          <SearchBar />
          <span className="fs-4 fw-semibold mt-2">All Blog Posts</span>
          <hr className="line" />
          <div className="mt-4 text-center">
            <div className="AddNewUser">
              <button
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#staticBackdrop"
              >
                Add New Blog Post
              </button>
            </div>
            <div className="table-small">
              <table className="  table  table-striped table-primary">
                <thead>
                  <tr>
                    <th scope="col">Blog Title</th>
                    <th scope="col">Blog Detail</th>
                    <th scope="col">Blog Image</th>
                    <th scope="col">Blog Date</th>
                    <th scope="col">Category</th>
                    <th scope="col">Therapist Name</th>

                    <th colSpan="2">Make Changes</th>
                  </tr>
                </thead>
                <tbody>
                  {blogs.map((blog) => (
                    <tr key={blog.id}>
                      <th>{blog.blog_title}</th>
                      <td>
                        <div
                          style={{
                            maxHeight: "150px",
                            overflowY: "auto",
                            whiteSpace: "normal",
                          }}
                        >
                          {blog.blog_detail}
                        </div>
                      </td>
                      <td>{blog.blog_image}</td>
                      <td>{blog.blog_date}</td>
                      <td>{blog.blog_category}</td>
                      <td>{blog.therapist_name}</td>

                      <td>
                        <button
                          className="btn btn-success"
                          onClick={() => handleEditBtn(blog)}
                          data-bs-toggle="modal"
                          data-bs-target="#editUserModal"
                        >
                          Edit
                        </button>
                      </td>
                      <td>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDeleteBtn(blog.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div
              className="modal fade"
              id="staticBackdrop"
              data-bs-backdrop="static"
              data-bs-keyboard="false"
              tabIndex="-1"
              aria-labelledby="staticBackdropLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div
                  className="modal-content"
                  style={{ backgroundColor: "#e3f2fd" }}
                >
                  <div
                    className="modal-header "
                    style={{ backgroundColor: "#bbdefb" }}
                  >
                    <h1
                      className="modal-title fs-5"
                      id="exampleModalLabel"
                      style={{ color: "#0d47a1" }}
                    >
                      Fill the contents below
                    </h1>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body">
                    <form onSubmit={handleNewBlog}>
                      <div className="mb-3">
                        <label htmlFor="title" className="form-label">
                          Enter Blog Title:
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="blogTitle"
                          aria-required="true"
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="title" className="form-label">
                          Enter Blog's detail:
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="blogDetail"
                          aria-required="true"
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="title" className="form-label">
                          Enter Blog's Category:
                        </label>
                        <select
                          className="form-control"
                          name="blog_category"
                          value={newData.blog_category}
                          onChange={handleEdit}
                        >
                          <option value="">Select Category</option>
                          {[
                            "Anxiety",
                            "Depression",
                            "OCD",
                            "Sleep Paralysis",
                          ].map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="mb-3">
                        <label htmlFor="title" className="form-label">
                          Enter Therapist Name
                        </label>
                        <select
                          className="form-control"
                          name="therapist_id"
                          value={newData.therapist_id}
                          onChange={handleEdit}
                        >
                          <option value="">Select Therapist</option>
                          {doctors.map((doctor) => (
                            <option key={doctor.id} value={doctor.id}>
                              {doctor.user.user_fullname}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="mb-3">
                        <label htmlFor="title" className="form-label">
                          Enter Blog Picture
                        </label>
                        <input
                          type="file"
                          className="form-control"
                          name="blogImage"
                          aria-required="true"
                        />
                      </div>
                      <div className="modal-footer">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          data-bs-dismiss="modal"
                        >
                          Close
                        </button>
                        <button type="submit" className="btn btn-primary">
                          Post
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="modal fade"
              id="editUserModal"
              tabIndex="-1"
              aria-hidden="true"
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Edit User Details</h5>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body">
                    <form onSubmit={(e) => handleEditBlog(e, editId)}>
                      <div className="mb-3">
                        <label className="form-label">Blog Title</label>
                        <input
                          type="text"
                          name="blog_title"
                          className="form-control"
                          value={newData.blog_title}
                          onChange={handleEdit}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Blog Detail</label>
                        <input
                          type="text"
                          name="blog_detail"
                          className="form-control"
                          value={newData.blog_detail}
                          onChange={handleEdit}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Therapist Name</label>
                        <select
                          className="form-control"
                          name="therapist_id"
                          value={newData.therapist_id}
                          onChange={handleEdit}
                        >
                          <option value="">Select Therapist</option>
                          {doctors.map((doctor) => (
                            <option key={doctor.id} value={doctor.id}>
                              {doctor.user.user_fullname}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Category</label>
                        <select
                          className="form-control"
                          name="blog_category"
                          value={newData.blog_category}
                          onChange={handleEdit}
                        >
                          <option value="">Select Category</option>
                          {[
                            "Anxiety",
                            "Depression",
                            "OCD",
                            "Sleep Paralysis",
                          ].map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Blog Photo</label>
                        <input
                          type="file"
                          name="blog_image"
                          className="form-control"
                          onChange={(e) =>
                            setNewData((prev) => ({
                              ...prev,
                              blog_image: e.target.files[0],
                            }))
                          }
                        />
                      </div>

                      <div className="modal-footer">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          data-bs-dismiss="modal"
                        >
                          Close
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
        </div>
      </div>
    </div>
  );
}
