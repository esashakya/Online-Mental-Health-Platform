import React, { useState, useEffect, useContext } from "react";
import SearchBar from "../user/SearchBar";
import AuthContext from "../../context/AuthContext";

export default function DoctorTable() {
  const [doctors, setDoctor] = useState([]);
  const [editId, setEditId] = useState(null);
  const [newData, setNewData] = useState({user_email: "",
    user_fullname: "",
    user_gender: "",
    doctor_photo: "",
    doctor_type: "",
    doctor_degree: "",
    doctor_availableTime: "",});

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

  const { registerNewDoctor } = useContext(AuthContext);

  const handleNewDoctor = async (e) => {
    // Prevent page refresh
    e.preventDefault();

    const user_email = e.target.doctorEmail.value;
    const user_fullname = e.target.doctorName.value;
    const user_gender = e.target.doctorGender.value;
    const doctor_photo = e.target.picture.files[0];
    const doctor_type = e.target.type.value;
    const doctor_availableTime = e.target.availableTime.value;
    const doctor_degree = e.target.degree.value;
    const password = e.target.doctorPassword.value;
    const retype_password = e.target.doctorRetypePassword.value;
    const user_role = 3;

    const formData = new FormData();
    formData.append("user_email", user_email);
    formData.append("user_fullname", user_fullname);
    formData.append("user_gender", user_gender);
    formData.append("user_role", user_role);
    formData.append("doctor_photo", doctor_photo);
    formData.append("doctor_type", doctor_type);
    formData.append("doctor_availableTime", doctor_availableTime);
    formData.append("doctor_degree", doctor_degree);
    formData.append("password", password);
    formData.append("retype_password", retype_password);

    // Register the doctor if the email is valid
    user_email.length > 0 && registerNewDoctor(formData);
  };

  const handleEditBtn = (doctor) => {
    setEditId(doctor.id);
    setNewData({
      user_email: doctor?.user?.user_email || "",
      user_fullname: doctor?.user?.user_fullname || "",
      user_gender: doctor?.user?.user_gender || "1",
      doctor_photo: doctor.doctor_photo || null,
      doctor_type: doctor.doctor_type || "",
      doctor_degree: doctor.doctor_degree || "",
      doctor_availableTime: doctor.doctor_availableTime || "",
    });
  };
  

  const handleEdit = (e) => {
    const { name, value } = e.target;
    setNewData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditDoctor = async (e, doctorId) => {
    e.preventDefault();
    
    const updatedData = new FormData();
    
    // get the data of chosen doctor
    const currentDoctor = doctors.find((doctor) => doctor.id === doctorId);
    const currentUser = currentDoctor?.user; //since user data is also nested in doctor model
  
    // only change edited data
    if (newData.user_email !== currentUser?.user_email) {
      updatedData.append("user_email", newData.user_email);
    }
    console.log(currentUser?.user_email)
    console.log(newData.user_email)
    console.log(updatedData)
    if (newData.user_fullname !== currentUser?.user_fullname) {
      updatedData.append("user_fullname", newData.user_fullname);
    }
  
    if (newData.user_gender !== currentUser?.user_gender) {
      updatedData.append("user_gender", newData.user_gender);
    }

    if (newData.doctor_type !== currentDoctor?.doctor_type) {
      updatedData.append("doctor_type", newData.doctor_type);
    }
  
    if (newData.doctor_degree !== currentDoctor?.doctor_degree) {
      updatedData.append("doctor_degree", newData.doctor_degree);
    }
  
    if (newData.doctor_availableTime !== currentDoctor?.doctor_availableTime) {
      updatedData.append("doctor_availableTime", newData.doctor_availableTime);
    }
  
    if (newData.doctor_photo && newData.doctor_photo !== currentDoctor?.doctor_photo) {
      updatedData.append("doctor_photo", newData.doctor_photo);
    }
  
    // updatedData only stores the data which was edited
    if (
      updatedData.has("user_email") ||
      updatedData.has("user_fullname") ||
      updatedData.has("user_gender") ||
      updatedData.has("doctor_type") ||
      updatedData.has("doctor_degree") ||
      updatedData.has("doctor_availableTime") ||
      updatedData.has("doctor_photo")
    ) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/update/doctors/${doctorId}`, {
          method: "PUT",
          body: updatedData,
        });
  
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
    } else {
      console.log("No changes made");
    }
  };
  // delete
  const handleDeleteBtn = async (pk) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/update/doctors/${pk}`, {
        method: "DELETE",
      });
  
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
                  <th scope="col">Degree</th>
                  <th scope="col">Available</th>
                  <th colSpan="2">Make Changes</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((doctor) => (
                  <tr key={doctor.id}>
                    <td>{doctor?.user?.user_email}</td>
                    <td>{doctor?.user?.user_fullname}</td>
                    <td>{doctor?.user?.user_gender}</td>
                    <td>{doctor.doctor_photo}</td>
                    <td>{doctor.doctor_type}</td>
                    <td>{doctor.doctor_degree}</td>
                    <td>{doctor.doctor_availableTime}</td>
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

                        <button className="btn btn-danger w-100" onClick={() => handleDeleteBtn(doctor.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
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
                    <input
                      type="text"
                      name="doctor_type"
                      className="form-control"
                      value={newData.doctor_type}
                      onChange={handleEdit}
                    />
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
                    <label className="form-label">Available Time</label>
                    <input
                      type="time"
                      name="doctor_availableTime"
                      className="form-control"
                      value={newData.doctor_availableTime}
                      onChange={handleEdit}
                    />
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
                <form onSubmit={handleNewDoctor}>
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                      Enter Doctor's Email
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="doctorEmail"
                      aria-required="true"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                      Enter Doctor's Full Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="doctorName"
                      aria-required="true"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                      Enter Doctor's password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      name="doctorPassword"
                      aria-required="true"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                      Retype Doctor's password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      name="doctorRetypePassword"
                      aria-required="true"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                      Enter Doctor's Gender
                    </label>
                    <select className="form-control" name="doctorGender">
                      <option disabled>Choose the doctor gender</option>
                      <option value="1">Male</option>
                      <option value="2">Female</option>
                      <option value="3">Others</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                      Enter Picture
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      name="picture"
                      aria-required="true"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                      Enter Doctor's Type
                    </label>
                    <select className="form-control" name="type">
                      <option disabled>Choose the type of doctor</option>
                      <option value="1">Therapist</option>
                      <option value="2">Psychatrist</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                      Enter Doctor's Highest Degree
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="degree"
                      aria-required="true"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                      Available
                    </label>
                    <input
                      type="time"
                      className="form-control"
                      name="availableTime"
                      aria-required="true"
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
                      Post
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
