import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import useAxios from "../../utils/useAxios";
import Swal from "sweetalert2";

export default function BlogPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [commentAnonymous, setCommentAnonymous] = useState(false);
  const [loading, setLoading] = useState(true);
  const apiAxios = useAxios();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [blogResponse, commentsResponse] = await Promise.all([
          fetch(`http://127.0.0.1:8000/api/blog/${id}`),
          apiAxios.get(`/comments/?blog=${id}`) 
        ]);
        
        const blogData = await blogResponse.json();
        setBlog(blogData);
        setComments(commentsResponse.data);
        console.log(commentsResponse.data);

      } catch (error) {
        console.error("Error in blog details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    if (!user) {
      Swal.fire({
        title: "Login Required",
        text: "You need to be logged in to post comments",
        icon: "warning",
        confirmButtonText: "Go to Login",
      }).then(() => {
        navigate("/login");
      });
      return;
    }

    try {
      const response = await apiAxios.post("/comments/", {
        blog: parseInt(id),
        content: newComment,
        anonymous: commentAnonymous,
        comment_category: "Blog"
      });

      setComments([...comments, response.data]);
      setNewComment("");
      Swal.fire({
        title: "Comment posted!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false
      });
    } catch (err) {
      Swal.fire({
        title: "Error posting comment",
        text: err.response?.data?.detail || "Please try again",
        icon: "error"
      });
    }
  };

  if (loading) return <h5 className="text-center p-3 bg-primary-subtle text-primary-emphasis my-5">Loading blog details...</h5>;
  if (!blog) return <h5 className="text-center p-3 bg-danger-subtle text-danger-emphasis my-5">Error loading blog</h5>;

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

          {/* Comments Section */}
          <div className="mt-5 border-top pt-4">
            <h3 className="mb-4">Comments ({comments.length})</h3>
            
            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="mb-4">
              <div className="mb-3">
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Enter your thoughts for this blog..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3 form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="anonymousComment"
                  checked={commentAnonymous}
                  onChange={(e) => setCommentAnonymous(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="anonymousComment">
                  Post anonymously
                </label>
              </div>
              <button type="submit" className="btn btn-primary">
                Post Comment
              </button>
            </form>

            {/* Comments List */}
            <div className="comments-list">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="card mb-3">
                    <div className="card-body">
                      <p className="card-text">{comment.content}</p>
                      <div className="d-flex justify-content-between">
                        <small className="text-muted">
                          {comment.anonymous ? "Anonymous" : `By ${comment.user_fullname}`}
                        </small>
                        <small className="text-muted">
                          {new Date(comment.created_at).toLocaleString()}
                        </small>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="alert alert-info">No comments yet. Be the first to comment!</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}