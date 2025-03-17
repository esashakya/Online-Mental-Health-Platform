import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/AuthContext";
import AppointmentList from "./AppointmentList";

export default function UserProfile() {
  const { user } = useContext(AuthContext);
  const id = user.user_id;
  const [profile, setUser] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/get/user/${id}`
        );
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, [id]);

  // Check if profile is null before rendering content
  if (!profile) {
    return <div>Loading...</div>; // Or a loading spinner/message
  }

  return (
    <div className="container mt-5">
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
            <h2 className="text-white fw-bold">{profile.user_fullname}</h2>
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
              <button className="btn btn-secondary mt-2">Edit</button>
              <button className="btn btn-warning mt-2">Log Out</button>
            </div>
          </div>
        </div>
      </div>
      <div className="container mt-5">
        <AppointmentList/>
      </div>
    </div>
  );
}
