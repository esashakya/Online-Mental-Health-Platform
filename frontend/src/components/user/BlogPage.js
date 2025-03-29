import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function BlogPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/blog/${id}`);
        const data = await response.json();
        setBlog(data);
      } catch (error) {
        console.error("Error in blog details:", error);
      }
    };
    fetchBlog();
  }, [id]);

  if (!blog) return <h5 className="text-center p-3 bg-primary-subtle text-primary-emphasis my-5">Loading blog details...</h5>;

  //split the sentence when there is punctuation or fullstop
  let sentence = blog.blog_detail.split(/(?<=\.)\s+/);

  //divide the paragraph into three parts
  const para = Math.ceil(sentence.length / 3);
  const para1 = sentence.slice(0, para).join(" ");
  const para2 = sentence.slice(para, 2 * para).join(" ");
  const para3 = sentence.slice(2 * para).join(" ");

  return (
    <div className="container my-5">
      <div className="d-flex flex-column align-items-center">
        <div
          className="blog-img w-100 rounded shadow-lg overflow-hidden"
          style={{ height: "350px", backgroundSize: "cover", backgroundPosition: "center" }}
        >
          <img
            src={`http://localhost:8000${blog.blog_image}`}
            alt="Blog"
            className="rounded img-fluid border w-100 h-100 object-fit-cover"
          />
        </div>
        <div className="blog-description mt-4 p-4 w-100 border rounded shadow-sm bg-white">
          <div className="d-flex flex-wrap align-items-center justify-content-between">
            <h5 className="text-primary">Author: Dr. {blog.therapist_name}</h5>
            <span className="badge bg-info text-white fw-light">{blog.blog_category}</span>
            <h6 className="text-muted">Published on: {blog.blog_date}</h6>
          </div>
          <div className="blog-para mt-4">
            <h2 className="text-success text-center fw-bold mb-3">{blog.blog_title}</h2>
            
          
            <p className="text-secondary" style={{ lineHeight: "1.8", fontSize: "1.1rem" }}>
              {para1}
            </p>

          
            {para2 && (
              <p className="text-secondary" style={{ lineHeight: "1.8", fontSize: "1.1rem" }}>
                {para2}
              </p>
            )}

            
            {para3 && (
              <p className="text-secondary" style={{ lineHeight: "1.8", fontSize: "1.1rem" }}>
                {para3}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
