import AuthContext from "../../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import { useNavigate, Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import Typewriter from "typewriter-effect";
import React, { useState, useEffect, useContext } from "react";
import Swal from "sweetalert2";
const msg = require("sweetalert2");

export default function Blog() {
  const { user, authTokens } = useContext(AuthContext);
  const [blogs, setBlog] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [doctors, setDoctor] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const userToken = localStorage.getItem("authTokens");
  // get user role from token
  let userRole = null;
  let userName = null;
  if (userToken) {
    const parsedToken = JSON.parse(userToken);
    const decodedToken = jwtDecode(parsedToken.access); // Decode JWT
    userRole = decodedToken.user_role; // Extract user role
    userName = decodedToken.user_fullname;
  }
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/blogs/");
        const data = await response.json();
        console.log("blogs:", data);
        setBlog(data);
        setFilteredBlogs(data);
      } catch (error) {
        console.error("error due to:", error);
        setBlog([]);
        setFilteredBlogs([]);
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
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredBlogs(blogs); 
    } else {
      const filtered = blogs.filter(blog =>
        blog.blog_title.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredBlogs(filtered);
    }
  };

  const navigate = useNavigate();
  if (!user) {
    Swal.fire({
      title: "You need to be logged in",
      text: "Please log in to view blog posts.",
      icon: "warning",
      confirmButtonText: "Go to Login",
    }).then(() => {
      navigate("/login");
    });
  }
  return (
    <div>
      <div className="container">
        <div className="text-center">
          <h1 className="fw-bold pt-3">Blog</h1>
          <p className="fs-5 text-muted">
            <Typewriter
              options={{
                autoStart: true,
                loop: true,
                delay: 100,
                deleteSpeed: 100,
                strings: ["Discover articles written by our doctors"],
              }}
            />
          </p>
        </div>
        <SearchBar 
          searchQuery={searchQuery} 
          onSearchChange={(e) => handleSearch(e.target.value)} 
        />
        {userRole == 3 ? (
          <>
            <div
              className="AddNewBlog "
              style={{ display: "flex", justifyContent: "flex-end" }}
            >
              <button className="btn btn-primary">
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=finalyay1111@gmail.com"
                  className="btn btn-primary"
                >
                  Hello Dr. {userName} ! Do you want to send a new blog?
                </a>
              </button>
            </div>
          </>
        ) : null}
        <div className="row g-4 bg-white mt-3 px-3">
          {filteredBlogs.length > 0 ? (
            filteredBlogs.map((blog, index) => {
              const doctor = doctors.find(
                (doc) => doc.id === blog.therapist_id
              );
              return (
                <div
                  className="col-md-6 mb-4 blogContent d-flex flex-column"
                  key={blog.id || index}
                >
                  <div className="blogPicture pt-2">
                    <img
                      src={`http://127.0.0.1:8000${blog.blog_image}`}
                      alt="Blog Img"
                    ></img>
                    <div className="blogCredit text-start w-100">
                      <p>{blog.therapist_name} || Therapist</p>

                      <p>
                        {doctor ? (
                          <span className="text-success">
                            {doctor.doctor_degree}
                          </span>
                        ) : (
                          <span className="text-muted">
                            Degree not available
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className=" blogPost  p-2 h-100">
                    <h3 className="text-center">{blog.blog_title}</h3>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <p className="text-body-secondary">{blog.blog_date}</p>
                      <span className="badge rounded-pill text-bg-info fw-lighter">
                        {blog.blog_category}
                      </span>
                    </div>

                    <p className="text-dark truncate">{blog.blog_detail}</p>
                    <div className="text-start ">
                      <Link
                        to={`/Blog/${blog.id}`}
                        className="text-decoration-none"
                      >
                        Read More
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center">No blogs available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
