import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useAxios from "../../utils/useAxios";
import { Link } from "react-router-dom";
import msg from "sweetalert2";
import Footer from "./Footer";

const ForumPost = () => {
  const { id } = useParams();
  const apiAxios = useAxios();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [commentAnonymous, setCommentAnonymous] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchComments = async () => {
    try {
      const response = await apiAxios.get(`/comments/?forum=${id}`);
      setComments(response.data);
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
        console.error(id);
      const response = await apiAxios.post("/comments/", {
        forum: parseInt(id),
        content: newComment,
        anonymous: commentAnonymous,
        comment_category: "Forum"
      });

      setComments([...comments, response.data]);
      setNewComment("");
      msg.fire({
        title: "Comment posted!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false
      });
    } catch (err) {
      msg.fire({
        title: "Error posting comment",
        text: err.response?.data?.detail || "Please try again",
        icon: "error"
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postResponse, commentsResponse] = await Promise.all([
          apiAxios.get(`/forum/${id}/`),
          apiAxios.get(`/comments/?forum=${id}`)
        ]);
        // console.log(commentsResponse.data);
        setPost(postResponse.data);
        setComments(commentsResponse.data);
      } catch (err) {
        setError(err.message || "error comment section");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);
  console.log(post);
  if (!post || loading) return (
    <div className="d-flex flex-column justify-content-center align-items-center mb-3">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  return (
    <>
    <div className="container mt-4">
      <div className="bg-light rounded p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>{post.post_title}</h1>
          {/* to go back forum posts */}
          <Link to="/forum" className="btn btn-secondary">
            Back to Forum
          </Link>
        </div>
        
        <div className="mb-4">
          {/* to show personal information */}
          <p className="text-muted">
            Posted on: {new Date(post.post_date).toLocaleString()}
            {!post.anonymous && post.user_id && (
              <span> by User #{post.user_fullname}</span>
            )}
            {post.anonymous && <span> (Posted anonymously)</span>}
          </p>
        </div>
        
        <div className="card p-4 mb-4">
          <p className="fs-5">{post.post_detail}</p>
        </div>

        {/* comments part */}
        <div className="mt-5">
          <h3>Comments ({comments.length})</h3>
          
          {/* to add new comment form */}
          <form onSubmit={handleCommentSubmit} className="mb-4">
            <div className="mb-3">
              <textarea
                className="form-control"
                rows="3"
                placeholder="Share your thoughts..."
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

          {/* displaying the current forum's comments */}
          <div className="comments-list">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="card mb-3">
                  <div className="card-body">
                    <p className="card-text">{comment.content}</p>
                    <div className="d-flex justify-content-between">
                      <small className="text-muted">
                        {comment.anonymous ? "Anonymous" : `By User ${comment.user_fullname}`}
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
    <Footer/>
    </>
  );
};

export default ForumPost;