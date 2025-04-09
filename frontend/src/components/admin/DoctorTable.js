import React, { useState, useEffect, useContext } from "react";
import SearchBar from "../user/SearchBar";
import AuthContext from "../../context/AuthContext";

export default function DoctorTable() {
  const [doctors, setDoctor] = useState([]);
  const [editId, setEditId] = useState(null);
  const [newData, setNewData] = useState({
    user_email: "",
    user_fullname: "",
    user_gender: "",
    doctor_photo: "",
    doctor_type: "",
    doctor_degree: "",
    doctor_status: "",
    time_slots: [{ start_time: "", end_time: "" }],
  });

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/doctors/");
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
  const handleNewTimeSlotChange = (index, field, value) => {
    const updatedTimeSlots = [...newDoctor.time_slots];
    updatedTimeSlots[index][field] = value;
    setNewDoctor((prev) => ({
      ...prev,
      time_slots: updatedTimeSlots,
    }));
  };
  const removeNewTimeSlot = (index) => {
    setNewDoctor((prev) => ({
      ...prev,
      time_slots: prev.time_slots.filter((_, i) => i !== index),
    }));
  };
  const addNewTimeSlot = () => {
    setNewDoctor((prev) => ({
      ...prev,
      time_slots: [...prev.time_slots, { start_time: "", end_time: "" }],
    }));
  };
  const [newDoctor, setNewDoctor] = useState({
    user_email: "",
    user_fullname: "",
    user_gender: "1",
    doctor_photo: null,
    doctor_type: "1",
    doctor_status: "1",
    doctor_degree: "",
    password: "",
    retype_password: "",
    time_slots: [{ start_time: "", end_time: "" }],
  });

  const handleNewDoctorChange = (e) => {
    const { name, value } = e.target;
    setNewDoctor((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const { registerNewDoctor } = useContext(AuthContext);

  const handleNewDoctor = async (e) => {
    e.preventDefault();

    try {
        const formData = new FormData();

        // Add all basic fields
        formData.append("user_email", newDoctor.user_email);
        formData.append("user_fullname", newDoctor.user_fullname);
        formData.append("user_gender", newDoctor.user_gender);
        
        if (newDoctor.doctor_photo) {
            formData.append("doctor_photo", newDoctor.doctor_photo);
        }
        formData.append("doctor_type", newDoctor.doctor_type);
        formData.append("doctor_status", newDoctor.doctor_status);
        formData.append("doctor_degree", newDoctor.doctor_degree);
        formData.append("password", newDoctor.password);
        formData.append("retype_password", newDoctor.retype_password);

        // Prepare time slots as an array of objects
        const timeSlotsData = newDoctor.time_slots
            .filter(slot => slot.start_time && slot.end_time)
            .map(slot => ({
                start_time: formatTime(slot.start_time),
                end_time: formatTime(slot.end_time)
            }));

        if (timeSlotsData.length === 0) {
            alert("Please add at least one valid time slot");
            return;
        }

        // NEW APPROACH: Append each time slot individually
        timeSlotsData.forEach((slot, index) => {
            formData.append(`time_slots[${index}][start_time]`, slot.start_time);
            formData.append(`time_slots[${index}][end_time]`, slot.end_time);
        });

        // Debug: log form data
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }

        await registerNewDoctor(formData);
        
       
       
        
    } catch (error) {
        console.error("Error submitting form:", error);
        alert("Error submitting form. Please check console for details.");
    }
};

// Utility function to ensure time format
const formatTime = (time) => {
    if (!time) return "";
    // If already in HH:MM:SS format, return as is
    if (time.match(/^\d{2}:\d{2}:\d{2}$/)) return time;
    // If in HH:MM format, add seconds
    if (time.match(/^\d{2}:\d{2}$/)) return `${time}:00`;
    return time;
};





  const handleEditBtn = (doctor) => {
    setEditId(doctor.id);
    setNewData({
      user_email: doctor?.user?.user_email || "",
      user_fullname: doctor?.user?.user_fullname || "",
      user_gender: doctor?.user?.user_gender || "1",
      doctor_photo: doctor.doctor_photo || null,
      doctor_type: doctor.doctor_type || "",
      doctor_status: doctor.doctor_status || "",
      doctor_degree: doctor.doctor_degree || "",
      time_slots:
        doctor.time_slots?.length > 0
          ? doctor.time_slots.map((slot) => ({
              start_time: slot.start_time || "",
              end_time: slot.end_time || "",
            }))
          : [{ start_time: "", end_time: "" }],
    });
  };

  const handleEdit = (e) => {
    const { name, value } = e.target;
    setNewData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleTimeSlotChange = (index, field, value) => {
    const updatedTimeSlots = [...newData.time_slots];
    updatedTimeSlots[index][field] = value;
    setNewData((prev) => ({
      ...prev,
      time_slots: updatedTimeSlots,
    }));
  };

  const addTimeSlot = () => {
    setNewData((prev) => ({
      ...prev,
      time_slots: [...prev.time_slots, { start_time: "", end_time: "" }],
    }));
  };

  const removeTimeSlot = (index) => {
    setNewData((prev) => ({
      ...prev,
      time_slots: prev.time_slots.filter((_, i) => i !== index),
    }));
  };

  const handleEditDoctor = async (e, doctorId) => {
    e.preventDefault();

    const updatedData = new FormData();
    const currentDoctor = doctors.find((doctor) => doctor.id === doctorId);
    const currentUser = currentDoctor?.user;

    if (newData.user_email !== currentUser?.user_email) {
      updatedData.append("user_email", newData.user_email);
    }
    if (newData.user_fullname !== currentUser?.user_fullname) {
      updatedData.append("user_fullname", newData.user_fullname);
    }
    if (newData.user_gender !== currentUser?.user_gender) {
      updatedData.append("user_gender", newData.user_gender);
    }
    if (newData.doctor_type !== currentDoctor?.doctor_type) {
      updatedData.append("doctor_type", newData.doctor_type);
    }
    if (newData.doctor_status !== currentDoctor?.doctor_status) {
      updatedData.append("doctor_status", newData.doctor_status);
    }
    if (newData.doctor_degree !== currentDoctor?.doctor_degree) {
      updatedData.append("doctor_degree", newData.doctor_degree);
    }
    if (
      newData.doctor_photo &&
      newData.doctor_photo !== currentDoctor?.doctor_photo
    ) {
      updatedData.append("doctor_photo", newData.doctor_photo);
    }

    const timeSlotsCleaned = newData.time_slots
      .filter((slot) => slot.start_time && slot.end_time)
      .map((slot) => ({
        ...slot,
        doctor_id: doctorId,
      }));

    updatedData.append("time_slots", JSON.stringify(timeSlotsCleaned));
    console.log("Sending time slots:", JSON.stringify(newData.time_slots));

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/update/doctors/${doctorId}`,
        {
          method: "PUT",
          body: updatedData,
        }
      );

      const data = await response.json();
      console.log("Response status:", response.status);
      console.log("Response data:", data);

      if (!response.ok) {
        console.error("Update fail:", data);
      } else {
        console.log("success:", data);
        window.location.reload();
      }
    } catch (error) {
      console.error("Error while editing:", error);
    }
  };

  const handleDeleteBtn = async (pk) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/update/doctors/${pk}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(`Error while deleting: ${response.status}`);
      }
      window.location.reload();
      setDoctor((prev) => prev.filter((doctor) => doctor.id !== pk));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <div className="d-flex flex-column m-4">
        <SearchBar />
        <span className="fs-4 fw-semibold mt-2">
          All Registered Doctor Accounts
        </span>
        <hr className="line" />
        <div className="mt-4 text-center">
          <div className="AddNewUser">
            <button
              className="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#staticBackdrop"
            >
              Add New Doctors
            </button>
          </div>
          <div className="table-small">
            <table className="table table-striped table-primary">
              <thead>
                <tr>
                  <th scope="col">Email</th>
                  <th scope="col">Full Name</th>
                  <th scope="col">Gender</th>
                  <th scope="col">Photo</th>
                  <th scope="col">Type</th>
                  <th scope="col">Status</th>
                  <th scope="col">Degree</th>
                  <th scope="col">Time Slots</th>
                  <th colSpan="2">Make Changes</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((doctor) => (
                  <tr key={doctor.id}>
                    <td>{doctor?.user?.user_email}</td>
                    <td>{doctor?.user?.user_fullname}</td>
                    <td>
                      {doctor?.user?.user_gender === "1"
                        ? "Male"
                        : doctor?.user?.user_gender === "2"
                        ? "Female"
                        : "Others"}
                    </td>
                    <td>
                      <img
                        src={`http://127.0.0.1:8000${doctor.doctor_photo}`}
                        alt="Doctor"
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                        }}
                      />
                    </td>
                    <td>
                      {doctor.doctor_type === 1 ? "Therapist" : "Psychiatrist"}
                    </td>
                    <td>
                      {doctor.doctor_status === 1 ? "Working" : "On leave"}
                    </td>
                    <td>{doctor.doctor_degree}</td>
                    <td>
                      {doctor.time_slots?.map((slot, index) => (
                        <div key={index}>
                          {slot.start_time} - {slot.end_time}
                        </div>
                      ))}
                    </td>
                    <td className="text-center">
                      <div className="d-flex flex-column justify-content-between">
                        <button
                          className="btn btn-success w-100"
                          onClick={() => handleEditBtn(doctor)}
                          data-bs-toggle="modal"
                          data-bs-target="#editDoctorModal"
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger w-100"
                          onClick={() => handleDeleteBtn(doctor.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit Doctor Modal */}
        <div
          className="modal fade"
          id="editDoctorModal"
          tabIndex="-1"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Doctor Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={(e) => handleEditDoctor(e, editId)}>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      name="user_email"
                      className="form-control"
                      value={newData.user_email}
                      onChange={handleEdit}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      name="user_fullname"
                      className="form-control"
                      value={newData.user_fullname}
                      onChange={handleEdit}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Gender</label>
                    <select
                      name="user_gender"
                      className="form-control"
                      value={newData.user_gender}
                      onChange={handleEdit}
                    >
                      <option value="1">Male</option>
                      <option value="2">Female</option>
                      <option value="3">Others</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Doctor Type</label>
                    <select
                      name="doctor_type"
                      className="form-control"
                      value={newData.doctor_type}
                      onChange={handleEdit}
                    >
                      <option value="1">Therapist</option>
                      <option value="2">Psychiatrist</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Doctor Status</label>
                    <select
                      name="doctor_status"
                      className="form-control"
                      value={newData.doctor_status}
                      onChange={handleEdit}
                    >
                      <option value="1">Working</option>
                      <option value="2">On leave</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Degree</label>
                    <input
                      type="text"
                      name="doctor_degree"
                      className="form-control"
                      value={newData.doctor_degree}
                      onChange={handleEdit}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Time Slots</label>
                    {newData.time_slots.map((slot, index) => (
                      <div key={index} className="d-flex mb-2">
                        <input
                          type="time"
                          className="form-control me-2"
                          value={slot.start_time}
                          onChange={(e) =>
                            handleTimeSlotChange(
                              index,
                              "start_time",
                              e.target.value
                            )
                          }
                        />
                        <input
                          type="time"
                          className="form-control me-2"
                          value={slot.end_time}
                          onChange={(e) =>
                            handleTimeSlotChange(
                              index,
                              "end_time",
                              e.target.value
                            )
                          }
                        />
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => removeTimeSlot(index)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={addTimeSlot}
                    >
                      Add Time Slot
                    </button>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Doctor Photo</label>
                    <input
                      type="file"
                      name="doctor_photo"
                      className="form-control"
                      onChange={(e) =>
                        setNewData((prev) => ({
                          ...prev,
                          doctor_photo: e.target.files[0],
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

        {/* Add New Doctor Modal */}
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
                className="modal-header"
                style={{ backgroundColor: "#bbdefb" }}
              >
                <h1 className="modal-title fs-5" style={{ color: "#0d47a1" }}>
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
                <form onSubmit={handleNewDoctor}>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      name="user_email"
                      className="form-control"
                      value={newDoctor.user_email}
                      onChange={handleNewDoctorChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      name="user_fullname"
                      className="form-control"
                      value={newDoctor.user_fullname}
                      onChange={handleNewDoctorChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      value={newDoctor.password}
                      onChange={handleNewDoctorChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Retype Password</label>
                    <input
                      type="password"
                      name="retype_password"
                      className="form-control"
                      value={newDoctor.retype_password}
                      onChange={handleNewDoctorChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Gender</label>
                    <select
                      name="user_gender"
                      className="form-control"
                      value={newDoctor.user_gender}
                      onChange={handleNewDoctorChange}
                    >
                      <option value="1">Male</option>
                      <option value="2">Female</option>
                      <option value="3">Others</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Doctor Photo</label>
                    <input
                      type="file"
                      name="doctor_photo"
                      className="form-control"
                      onChange={(e) =>
                        setNewDoctor((prev) => ({
                          ...prev,
                          doctor_photo: e.target.files[0],
                        }))
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Doctor Type</label>
                    <select
                      name="doctor_type"
                      className="form-control"
                      value={newDoctor.doctor_type}
                      onChange={handleNewDoctorChange}
                    >
                      <option value="1">Therapist</option>
                      <option value="2">Psychiatrist</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Doctor Status</label>
                    <select
                      name="doctor_status"
                      className="form-control"
                      value={newDoctor.doctor_status}
                      onChange={handleNewDoctorChange}
                    >
                      <option value="1">Working</option>
                      <option value="2">On leave</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Degree</label>
                    <input
                      type="text"
                      name="doctor_degree"
                      className="form-control"
                      value={newDoctor.doctor_degree}
                      onChange={handleNewDoctorChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Time Slots</label>
                    {newDoctor.time_slots.map((slot, index) => (
                      <div key={index} className="d-flex mb-2">
                        <input
                          type="time"
                          className="form-control me-2"
                          value={slot.start_time}
                          onChange={(e) =>
                            handleNewTimeSlotChange(
                              index,
                              "start_time",
                              e.target.value
                            )
                          }
                          required
                        />
                        <input
                          type="time"
                          className="form-control me-2"
                          value={slot.end_time}
                          onChange={(e) =>
                            handleNewTimeSlotChange(
                              index,
                              "end_time",
                              e.target.value
                            )
                          }
                          required
                        />
                        {newDoctor.time_slots.length > 1 && (
                          <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => removeNewTimeSlot(index)}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={addNewTimeSlot}
                    >
                      Add Time Slot
                    </button>
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
                      Add Doctor
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
