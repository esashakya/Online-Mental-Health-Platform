import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/AuthContext";
import AppointmentList from "./AppointmentList";
const Swal = require("sweetalert2");

export default function UserProfile() {
  const { user, logoutRegisteredUser } = useContext(AuthContext);
  const [profile, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    user_fullname: "",
    user_email: "",
    user_gender: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");

  const id = user ? user.user_id : null;

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/get/user/${id}`
        );
        const data = await response.json();
        setUser(data);

        setEditForm({
          user_fullname: data.user_fullname,
          user_email: data.user_email,
          user_gender: data.user_gender,
        });
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    if (id) {
      fetchUserDetails();
    }
  }, [id]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);

    setUpdateMessage("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm({
      ...editForm,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const formData = new FormData();
      Object.keys(editForm).forEach((key) => {
        formData.append(key, editForm[key]);
      });

      const response = await fetch(`http://127.0.0.1:8000/api/users/${id}`, {
        method: "PUT",

        body: formData,
      });

      if (response.ok) {
        const updatedData = await response.json();
        setUser(updatedData);
        setIsEditing(false);
        Swal.fire({
          title: "Successfully updated your profile",
          text: "Your updated data has been successfully stored in our database.",
          icon: "success",
          confirmButtonText: "Okay",
          confirmButtonColor: "#4361ee",
          background: "#fff",
          color: "#333",
          showClass: {
            popup: "animate__animated animate__fadeIn",
          },
        });
      } else {
        const errorData = await response.json();
        console.error("Server response:", errorData);
        Swal.fire({
          title: "Error Occured while updating your data",
          text: "Please try again after few minutes. ",
          icon: "warning",
          confirmButtonText: "Okay",
          confirmButtonColor: "#4361ee",
          background: "#fff",
          color: "#333",
          showClass: {
            popup: "animate__animated animate__fadeIn",
          },
        });
      }
    } catch (error) {
      console.error("Error in database:", error);
      Swal.fire({
        title: "Error occured in server",
        text: "Please try again after few minutes. ",
        icon: "warning",
        confirmButtonText: "Okay",
        confirmButtonColor: "#4361ee",
        background: "#fff",
        color: "#333",
        showClass: {
          popup: "animate__animated animate__fadeIn",
        },
      });
    } finally {
      setIsUpdating(false);
    }
  };


  if (!profile) {
    return (
      <div className="d-flex justify-content-center align-items-center mb-3">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  if (!user) {
    return (
      <div className="d-flex justify-content-center align-items-center mb-3">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mt-5">
        {updateMessage && (
          <div
            className={`alert ${
              updateMessage.includes("failed") ||
              updateMessage.includes("Error")
                ? "alert-danger"
                : "alert-success"
            } mb-3`}
          >
            {updateMessage}
          </div>
        )}

        <div
          className="card shadow-lg p-4"
          style={{
            backgroundColor: "#262d79",
            color: "white",
            borderRadius: "15px",
          }}
        >
          <div className="row">
            <div className="col-md-4 mb-3 d-flex justify-content-center align-items-center">
              <img
                src={`http://localhost:8000/media/Doctors/default.png`}
                alt="Doctor image"
                className="rounded-circle border d-flex justify-content-center align-items-center"
                style={{ width: "200px", height: "200px", objectFit: "cover" }}
              />
            </div>
            <div className="col-md-8">
              {isEditing ? (
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="user_fullname" className="form-label">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="user_fullname"
                      name="user_fullname"
                      value={editForm.user_fullname}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="user_email" className="form-label">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="user_email"
                      name="user_email"
                      value={editForm.user_email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="user_gender" className="form-label">
                      Gender
                    </label>
                    <select
                      className="form-select"
                      id="user_gender"
                      name="user_gender"
                      value={editForm.user_gender}
                      onChange={handleChange}
                    >
                      <option value="">Select Gender</option>
                      <option value="1">Male</option>
                      <option value="2">Female</option>
                      <option value="3">Other</option>
                    </select>
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      type="submit"
                      className="btn bg-success-subtle text-success-emphasis"
                      disabled={isUpdating}
                    >
                      {isUpdating ? "Updating..." : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      className="btn bg-danger-subtle text-danger-emphasis"
                      onClick={handleEditToggle}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <h2 className="text-white fw-bold">
                    {profile.user_fullname}
                  </h2>
                  {user.user_role === 1 ? (
                    <p className="text-white fw-lighter">Normal User</p>
                  ) : (
                    <p className="text-white fw-lighter">Doctor</p>
                  )}

                  <hr />
                  <p>
                    <strong>Gender:</strong>{" "}
                    {profile.user_gender === 1
                      ? "Male"
                      : profile.user_gender === 2
                      ? "Female"
                      : profile.user_gender === 3
                      ? "Other"
                      : "Not Specified"}
                  </p>
                  <p>
                    <strong>Email Address:</strong> {profile.user_email}
                  </p>
                  <div className="row">
                    <button
                      className="btn bg-secondary-subtle text-secondary-emphasis mt-2"
                      onClick={handleEditToggle}
                    >
                      Edit
                    </button>

                    <button
                      className="btn bg-warning-subtle text-warning-emphasis mt-2"
                      onClick={logoutRegisteredUser}
                    >
                      Log Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="container mt-5">
          <AppointmentList />
        </div>
      </div>
    </>
  );
}
