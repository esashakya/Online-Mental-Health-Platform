import React, { useEffect, useState } from "react";
import SearchBar from "./SearchBar";

export default function Doctor() {
  const [doctor, setDoctor] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/doctors");
        const data = await response.json();
        console.log("doctors:", data);
        setDoctor(data);
      } catch (error) {
        console.error("error due to:", error);
        setDoctor([]);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <div>
      <div className="doctorsList text-center mt-4">
        <h1 style={{ color: "#194a7a" }}>Our Doctors</h1>
        <p className="fs-5 fst-italic">
          Our doctors are here to help. Feel free to consult with any doctor.
        </p>
      </div>
      <SearchBar/>
      <div className="container shadow-sm p-3 mb-5 bg-body-tertiary rounded">
        <div className="row mb-5">
          {doctor.length > 0 ? (
            doctor.map((doctor, index) => (
              <div
                key={index}
                className="col-sm-4 d-flex justify-content-center"
              >
                <div className="card mb-3" style={{ width: "20rem" }}>
                  <div className="doctor-img">
                    <img
                      src={`http://127.0.0.1:8000${doctor.doctor_photo}`}
                      className="card-img-top"
                      alt="Doctor"
                    />
                  </div>

                  <div className="card-body text-center">
                    <h5 className="card-title fw-bold ">
                      {doctor?.user?.user_fullname || "No Name"}
                    </h5>
                    <p className="card-text fst-italic">
                      {doctor?.user?.user_email || "No Email"}
                    </p>
                    <p className="card-text">
                      <span>Available Time:</span>
                      {doctor.doctor_availableTime || "Not Available"}
                    </p>
                    <p className="card-text">
                    <span>Degree:</span>
                      {doctor.doctor_degree || "Not Degree"}
                    </p>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => window.open(`/PreferredDoctor/${doctor.id}`, "_blank")}
                    >
                      Know More
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">No doctors available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
