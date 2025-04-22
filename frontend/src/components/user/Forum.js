import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import Typewriter from "typewriter-effect";
import AuthContext from "../../context/AuthContext";
import useAxios from "../../utils/useAxios";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
const msg = require("sweetalert2");

export default function Forum() {
  const apiAxios = useAxios();
  const [post, setPost] = useState([]);

  const { authTokens, user, addNewPost } = useContext(AuthContext);

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
  const handleNewPost = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const postTitle = e.target.postTitle.value;
    const postDetail = e.target.postDetail.value;
    const anonymous = e.target.elements.anonymous.value;

    if (!postTitle || !postDetail) {
      console.log("Missing fields");
      return;
    }

    try {
      const response = await apiAxios.post("/forum/", {
        post_title: postTitle,
        post_detail: postDetail,
        anonymous: anonymous,
        user_id: user.user_id,
      });

      if (response.status === 201) {
        setPost([response.data, ...post]);

        msg.fire({
          title: "Successfully uploaded your new post",
          icon: "success",
          toast: true,
          timer: 3000,
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

        // Refresh the page after 5 seconds
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }

      // Reset the form after successful submission
      e.target.reset();
    } catch (error) {
      // Handle errors here
      console.log("Error while adding:", error);
      msg.fire({
        title: "Error is found",
        icon: "error",
        toast: true,
        timer: 5000,
        position: "top-right",
        timerProgressBar: true,
        showConfirmButton: false,
        background: "#d9534f",
        color: "#ffffff",
        text: "Please try again later.",
        didOpen: () => {
          msg.showLoading();
        },
        willClose: () => {
          msg.hideLoading();
        },
      });
    }
  };
  const navigate = useNavigate();
  if (!user) {
    Swal.fire({
      title: "You need to be logged in",
      text: "Please log in to view forum posts.",
      icon: "warning",
      confirmButtonText: "Go to Login",
    }).then(() => {
      navigate("/login");
    });
  }

  return (
    <div>
      <div className="topicForum text-center mt-4">
        <h1>Forum</h1>
        <p className="fs-5 text-center">
          <Typewriter
            options={{
              autoStart: true,
              loop: true,
              delay: 50,
              deleteSpeed: 100,
              strings: [
                "A mental health forum is a safe haven—a place where voices are heard, struggles are shared,and healing begins through connection and understanding",
              ],
            }}
          />
        </p>
      </div>

      <div className="bg-light rounded p-3" style={{ margin: "5%" }}>
        <div className="newPost">
          <div
            className="postedData   p-3 "
            data-bs-toggle="modal"
            data-bs-target="#staticBackdrop"
          >
            <div className="row mb-3 align-items-center">
              <div className="titlePost col-8 col-md-8">
                <h5 className="fw-medium">Add a new post</h5>
              </div>
              <div className="dateData col-4 col-md-2 d-flex justify-content-end">
                <button
                  type="button"
                  className="btn btn-primary"
                  data-bs-toggle="modal"
                  data-bs-target="#staticBackdrop"
                  style={{
                    fontSize: "1.2rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#007AF5",
                  }}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="posts">
          {Array.isArray(post) && post.length > 0 ? (
            post.map((posts, index) => (
              <div key={index} className="postedData   p-3 ">
                <div className="row mb-3">
                  <div className="titlePost col-md-9">
                    <h2>{posts.post_title}</h2>
                  </div>
                  <div className="dateData col-md-3">
                    <h5 className="fw-medium">{posts.post_date}</h5>
                  </div>
                </div>

                <div className="detailsPost">
                  <p>{posts.post_detail}</p>
                </div>
                <div className="viewButton">
                  <button type="button" className="btn btn-primary">
                    <Link
                      to={`/Forum/${posts.id}`}
                      className="text-decoration-none text-white"
                    >
                      Read More
                    </Link>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">No forums available.</p>
          )}
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
          <div className="modal-content" style={{ backgroundColor: "#e3f2fd" }}>
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
              <form onSubmit={handleNewPost}>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    Enter your forum title:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    aria-required="true"
                    name="postTitle"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    Enter your post/opinions/thoughts:
                  </label>
                  <br />
                  <textarea
                    name="postDetail"
                    className="form-control"
                    rows="5"
                    aria-required="true"
                    required
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    Do you want to post Anonymously?
                  </label>
                  <br />
                  <input
                    type="radio"
                    value="1"
                    defaultChecked
                    name="anonymous"
                  />
                  Yes
                  <br />
                  <input type="radio" value="0" name="anonymous" />
                  No
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
    </div>
  );
}
