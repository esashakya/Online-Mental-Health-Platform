import React, { useState, useEffect, useContext } from "react";
import SearchBar from "../user/SearchBar";
import useAxios from "../../utils/useAxios";
const msg = require("sweetalert2");

export default function AdminForum() {
  const apiAxios = useAxios();
  const [posts, setPost] = useState([]);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await apiAxios.get("/forum/");
        console.log(" Res:", response.data);
        setPost(response.data);
        console.log("error", response);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPosts();
  }, []);
  // delete
  const handleDeleteBtn = async (pk) => {
    try {
      const response = await apiAxios.delete(`/forum/${pk}/`);
      console.log("Deletion success:", response);
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
                
              }})
            setTimeout(() => {
              window.location.reload();
            }, 5000);
            
            setPost((prev) => prev.filter((post) => post.id !== pk));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <div>
      <div className="d-flex flex-column m-4">
        <SearchBar />
        <span className="fs-4 fw-semibold mt-2">
          All Forum Posts
        </span>
        <hr className="line" />
        <div className="mt-4 text-center">
          
          <div className="table-small">
            <table className="table  table-striped table-primary">
              <thead>
                <tr>
                  <th scope="col">Sn</th>
                  <th scope="col">Id</th>
                  <th scope="col">Post Title</th>
                  <th scope="col">Post Detail</th>
                  <th scope="col">Post Date</th>
                  <th scope="col">Anonymous</th>
                  <th scope="col">User ID</th>
                  <th colSpan="2">Make Changes</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post, index) => (
                  <tr key={post.id}>
                    
                    <th>{index + 1}</th>
                    <td>{post.id}</td>
                    <td>{post.post_title}</td>
                    <td>{post.post_detail}</td>
                    <td>{post.post_date}</td>
                    <td>{post.anonymous ? "Yes" : "No"}</td>
                    <td>{post.user_id}</td>
                    <td>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDeleteBtn(post.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
                <form>
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                      Enter Patient's Email
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      aria-required="true"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                      Enter Patient's Full Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      aria-required="true"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                      Enter Doctor's Email
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      aria-required="true"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                      Enter Doctor's Full Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      aria-required="true"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                      Enter Chosen Time
                    </label>
                    <select className="form-control">
                      <option disabled>Choose the type of doctor</option>
                      <option value="50">50 mins</option>
                      <option value="80">80mins</option>
                    </select>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button type="button" className="btn btn-primary">
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
