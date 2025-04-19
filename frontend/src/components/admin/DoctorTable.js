import React, { useState, useEffect, useContext } from "react";
import SearchBar from "../user/SearchBar";
import AuthContext from "../../context/AuthContext";
const msg = require("sweetalert2");

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
  const [searchQuery, setSearchQuery] = useState("");
  const [presentPage, setPresentPage] = useState(1);
  const [dataPerPage] = useState(5);


  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor?.user?.user_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor?.user?.user_fullname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.doctor_degree?.toLowerCase().includes(searchQuery.toLowerCase())
  );

 
  const indexOfLastData = presentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;
  const currentData = filteredDoctors.slice(indexOfFirstData, indexOfLastData);

  const paginate = (pageNumber) => setPresentPage(pageNumber);
  const nextPage = () => {
    if (presentPage < Math.ceil(filteredDoctors.length / dataPerPage)) {
      setPresentPage(presentPage + 1);
    }
  };
  const prevPage = () => {
    if (presentPage > 1) {
      setPresentPage(presentPage - 1);
    }
  };

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/doctors/");
        const data = await response.json();
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

   
        timeSlotsData.forEach((slot, index) => {
            formData.append(`time_slots[${index}][start_time]`, slot.start_time);
            formData.append(`time_slots[${index}][end_time]`, slot.end_time);
        });

   
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }

        await registerNewDoctor(formData);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
       
       
        
    } catch (error) {
        console.error("Error submitting form:", error);
        alert("Error submitting form. Please check console for details.");
    }
};


const formatTime = (time) => {
    if (!time) return "";
  
    if (time.match(/^\d{2}:\d{2}:\d{2}$/)) return time;

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
      showToast("Update successful","Success");

        
      }
      window.location.reload();
    } catch (error) {
      console.error("Error while editing:", error);
      showToast("Please try again after few minutes","error");

    }
  };
  const showToast = (title, type) => {
      msg.fire({
        title,
        icon: type,
        toast: true,
        timer: 5000,
        position: "top-right",
        timerProgressBar: true,
        showConfirmButton: false,
        background: type === "error" ? "#dc3545" : "#28a745",
        color: "#ffffff",
      });
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
      showToast("Deletion successful","Success");
      
      setDoctor((prev) => prev.filter((doctor) => doctor.id !== pk));
    } catch (error) {
      console.error("Error:", error);
      showToast("Please try again after few minutes","error");
    }
    window.location.reload();
  };

  return (
    <div className="container my-4 p-4 bg-light rounded shadow-sm">
    <SearchBar searchQuery={searchQuery} onSearchChange={(e) => setSearchQuery(e.target.value)} />

    <div className="d-flex justify-content-between align-items-center mt-4">
      <h4 className="text-primary fw-semibold">
       
        Registered Doctor Accounts
      </h4>
      <button
        className="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#staticBackdrop"
      >
        
        Add New Doctor
      </button>
    </div>
    <hr className="border-primary opacity-25" />

    <div className="table-responsive mt-4">
      <table className="table table-bordered table-hover align-middle">
        <thead className="table-primary text-white">
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Full Name</th>
            <th>Photo</th>
            <th>Specialty</th>
            <th>Status</th>
            <th>Qualifications</th>
            <th>Availability</th>
            <th colSpan="2" className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((doctor) => (
            <tr key={doctor.id}>
              <td>{doctor.id}</td>
              <td>{doctor?.user?.user_email}</td>
              <td>{doctor?.user?.user_fullname}</td>
              <td>
                <img
                  src={`http://127.0.0.1:8000${doctor.doctor_photo}`}
                  alt="Doctor"
                  className="rounded-circle"
                  style={{
                    width: "50px",
                    height: "50px",
                    objectFit: "cover",
                    border: "2px solid #e3f2fd"
                  }}
                />
              </td>
              <td>
                <span className={`badge ${
                  doctor.doctor_type === 1 ? 'bg-info' : 'bg-primary'
                }`}>
                  {doctor.doctor_type === 1 ? "Therapist" : "Psychiatrist"}
                </span>
              </td>
              <td>
                <span className={`badge ${
                  doctor.doctor_status === 1 ? 'bg-success' : 'bg-warning'
                }`}>
                  {doctor.doctor_status === 1 ? "Active" : "On Leave"}
                </span>
              </td>
              <td>{doctor.doctor_degree}</td>
              <td>
                {doctor.time_slots?.map((slot, index) => (
                  <div key={index} className="small">
                    {slot.start_time} - {slot.end_time}
                  </div>
                ))}
              </td>
              <td>
                <button
                  className="btn btn-sm btn-outline-primary w-100 mb-2"
                  onClick={() => handleEditBtn(doctor)}
                  data-bs-toggle="modal"
                  data-bs-target="#editDoctorModal"
                >
                   Edit
                </button>
              </td>
              <td>
                <button
                  className="btn btn-sm btn-outline-danger w-100"
                  onClick={() => handleDeleteBtn(doctor.id)}
                >
                  <i className="bi bi-trash me-1"></i> Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <nav aria-label="Doctor table pagination">
        <ul className="pagination float-end mt-3">
          <li className={`page-item ${presentPage === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={prevPage}>
              <i className="bi bi-chevron-left"></i>
            </button>
          </li>
          
          <li className={`page-item ${presentPage === Math.ceil(filteredDoctors.length / dataPerPage) ? 'disabled' : ''}`}>
            <button className="page-link" onClick={nextPage}>
              <i className="bi bi-chevron-right"></i>
            </button>
          </li>
        </ul>
      </nav>
    </div>

    {/* Edit Doctor Modal */}
    <div className="modal fade" id="editDoctorModal" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content border-0 shadow">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">
              
              Edit Doctor Details
            </h5>
            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <form onSubmit={(e) => handleEditDoctor(e, editId)}>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Email Address</label>
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
                      className="form-select"
                      value={newData.user_gender}
                      onChange={handleEdit}
                    >
                      <option value="1">Male</option>
                      <option value="2">Female</option>
                      <option value="3">Other</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Specialty</label>
                    <select
                      name="doctor_type"
                      className="form-select"
                      value={newData.doctor_type}
                      onChange={handleEdit}
                    >
                      <option value="1">Therapist</option>
                      <option value="2">Psychiatrist</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Status</label>
                    <select
                      name="doctor_status"
                      className="form-select"
                      value={newData.doctor_status}
                      onChange={handleEdit}
                    >
                      <option value="1">Active</option>
                      <option value="2">On Leave</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Qualifications</label>
                    <input
                      type="text"
                      name="doctor_degree"
                      className="form-control"
                      value={newData.doctor_degree}
                      onChange={handleEdit}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Profile Photo</label>
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

              <div className="mb-3">
                <label className="form-label">Availability Schedule</label>
                {newData.time_slots.map((slot, index) => (
                  <div key={index} className="row g-2 mb-2">
                    <div className="col-md-5">
                      <label className="small text-muted">Start Time</label>
                      <input
                        type="time"
                        className="form-control"
                        value={slot.start_time}
                        onChange={(e) =>
                          handleTimeSlotChange(
                            index,
                            "start_time",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="col-md-5">
                      <label className="small text-muted">End Time</label>
                      <input
                        type="time"
                        className="form-control"
                        value={slot.end_time}
                        onChange={(e) =>
                          handleTimeSlotChange(
                            index,
                            "end_time",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="col-md-2 d-flex align-items-end">
                      <button
                        type="button"
                        className="btn btn-outline-danger w-100"
                        onClick={() => removeTimeSlot(index)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-outline-primary mt-2"
                  onClick={addTimeSlot}
                >
                  <i className="bi bi-plus-circle me-1"></i> Add Time Slot
                </button>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    {/* Add New Doctor Modal */}
    <div className="modal fade" id="staticBackdrop" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content border-0 shadow">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">
             
              Register New Doctor
            </h5>
            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <form onSubmit={handleNewDoctor}>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Email Address</label>
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
                    <label className="form-label">Confirm Password</label>
                    <input
                      type="password"
                      name="retype_password"
                      className="form-control"
                      value={newDoctor.retype_password}
                      onChange={handleNewDoctorChange}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Gender</label>
                    <select
                      name="user_gender"
                      className="form-select"
                      value={newDoctor.user_gender}
                      onChange={handleNewDoctorChange}
                    >
                      <option value="1">Male</option>
                      <option value="2">Female</option>
                      <option value="3">Other</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Specialty</label>
                    <select
                      name="doctor_type"
                      className="form-select"
                      value={newDoctor.doctor_type}
                      onChange={handleNewDoctorChange}
                    >
                      <option value="1">Therapist</option>
                      <option value="2">Psychiatrist</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Status</label>
                    <select
                      name="doctor_status"
                      className="form-select"
                      value={newDoctor.doctor_status}
                      onChange={handleNewDoctorChange}
                    >
                      <option value="1">Active</option>
                      <option value="2">On Leave</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Qualifications</label>
                    <input
                      type="text"
                      name="doctor_degree"
                      className="form-control"
                      value={newDoctor.doctor_degree}
                      onChange={handleNewDoctorChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Profile Photo</label>
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
                <label className="form-label">Availability Schedule</label>
                {newDoctor.time_slots.map((slot, index) => (
                  <div key={index} className="row g-2 mb-2">
                    <div className="col-md-5">
                      <label className="small text-muted">Start Time</label>
                      <input
                        type="time"
                        className="form-control"
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
                    </div>
                    <div className="col-md-5">
                      <label className="small text-muted">End Time</label>
                      <input
                        type="time"
                        className="form-control"
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
                    </div>
                    <div className="col-md-2 d-flex align-items-end">
                      {newDoctor.time_slots.length > 1 && (
                        <button
                          type="button"
                          className="btn btn-outline-danger w-100"
                          onClick={() => removeNewTimeSlot(index)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-outline-primary mt-2"
                  onClick={addNewTimeSlot}
                >
                  <i className="bi bi-plus-circle me-1"></i> Add Time Slot
                </button>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Register Doctor
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  );
}
