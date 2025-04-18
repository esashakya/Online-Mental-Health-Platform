import React, { useState, useEffect, useContext } from "react";
import SearchBar from "../user/SearchBar";
import AuthContext from "../../context/AuthContext";
const msg = require("sweetalert2");

export default function UserTable() {
  const [users, setUser] = useState([]);
  const [editId, setEditId] = useState(null);
  const [newData, setNewData] = useState({
    user_email: "",
    user_fullname: "",
    user_gender: "",
    password: "",
  });
  const [presentPage, setPresentPage] = useState(1);
  const [dataPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const filteredUsers = users.filter(
    (user) =>
      user.user_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.user_fullname.toLowerCase().includes(searchQuery.toLowerCase())
  );
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/users/");
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("error due to:", error);
        setUser([]);
      }
    };
    fetchUsers();
  }, []);

  const { addNewUser } = useContext(AuthContext);

  const handleNewUser = async (e) => {
    e.preventDefault();

    const user_email = e.target.userEmail.value;
    const user_fullname = e.target.userName.value;
    const user_gender = e.target.userGender.value;
    const password = e.target.userPassword.value;
    const retype_password = e.target.userRetypePassword.value;

    if (
      !user_email ||
      !user_fullname ||
      !user_gender ||
      !password ||
      !retype_password
    ) {
      showToast("All fields are required!", "error");
      return;
    }

    if (password !== retype_password) {
      showToast("Passwords do not match. Please try again", "error");
      return;
    }

    const formData = new FormData();
    formData.append("user_fullname", user_fullname);
    formData.append("user_email", user_email);
    formData.append("user_gender", user_gender);
    formData.append("user_role", 1);
    formData.append("password", password);
    formData.append("retype_password", retype_password);

    try {
      await addNewUser(formData);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Error", error);
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
      const response = await fetch(`http://127.0.0.1:8000/api/users/${pk}`, {
        method: "DELETE",
      });

      if (!response.ok)
        throw new Error(`Error while deleting: ${response.status}`);

      showToast("Deletion Successful", "success");

      setTimeout(() => {
        window.location.reload();
      }, 5000);

      setUser((prev) => prev.filter((user) => user.id !== pk));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleEditBtn = (user) => {
    setEditId(user.id);
    setNewData({
      user_email: user.user_email || "",
      user_fullname: user.user_fullname || "",
      user_gender: user.user_gender || "1",
    });
  };

  const handleEdit = (e) => {
    const { name, value } = e.target;
    setNewData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditUser = async (e, userId) => {
    e.preventDefault();

    const updatedData = new FormData();
    const currentUser = users.find((user) => user.id === userId);

    if (newData.user_email !== currentUser?.user_email) {
      updatedData.append("user_email", newData.user_email);
    }
    if (newData.user_fullname !== currentUser?.user_fullname) {
      updatedData.append("user_fullname", newData.user_fullname);
    }
    if (newData.user_gender !== currentUser?.user_gender) {
      updatedData.append("user_gender", newData.user_gender);
    }

    if (
      updatedData.has("user_email") ||
      updatedData.has("user_fullname") ||
      updatedData.has("user_gender")
    ) {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/users/${userId}`,
          {
            method: "PUT",
            body: updatedData,
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Update failed:", errorData);
        } else {
          window.location.reload();
        }
      } catch (error) {
        console.error("Error while editing:", error);
      }
    }
  };
  const indexOfLastData = presentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;
  const currentData = filteredUsers.slice(indexOfFirstData, indexOfLastData);


  const paginate = (pageNumber) => setPresentPage(pageNumber);

 
  const nextPage = () => {
    if (presentPage < Math.ceil(filteredUsers.length / dataPerPage)) {
      setPresentPage(presentPage + 1);
    }
  };

  const prevPage = () => {
    if (presentPage > 1) {
      setPresentPage(presentPage - 1);
    }
  };
  return (
    <div className="container my-4 p-3 bg-light rounded shadow-sm">
      <SearchBar searchQuery={searchQuery} onSearchChange={(e) => setSearchQuery(e.target.value)} />

      <div className="d-flex justify-content-between align-items-center mt-4">
        <h4 className="text-primary fw-semibold">
          All Registered User Accounts
        </h4>
        <button
          className="btn btn-outline-primary"
          data-bs-toggle="modal"
          data-bs-target="#staticBackdrop"
        >
          Add New User
        </button>
      </div>
      <hr />
      <div className="table-responsive mt-4">
      
        <table className="table table-bordered table-striped table-hover align-middle">
          <thead className="table-primary">
            <tr>
              <th>User Id</th>
              <th>User Email</th>
              <th>Full Name</th>
              <th>Gender</th>
              <th>Role</th>
              <th colSpan="2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.user_email}</td>
                <td>{user.user_fullname}</td>
                <td>{user.user_gender === 1 ? "Male" : user.user_gender === 2 ? "Female" : "Other"}</td>
                <td>{user.user_role === 1? "Normal User": user.user_role === 2? "Admin" : "Doctor"}</td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-success"
                    onClick={() => handleEditBtn(user)}
                    data-bs-toggle="modal"
                    data-bs-target="#editUserModal"
                  >
                    Edit
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDeleteBtn(user.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <nav aria-label="Doctor table pagination">
        <ul className="pagination float-end mt-3">
          <li className={`page-item ${presentPage === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={prevPage}>
              <i className="bi bi-chevron-left"></i>
            </button>
          </li>
          
          <li className={`page-item ${presentPage === Math.ceil(filteredUsers.length / dataPerPage) ? 'disabled' : ''}`}>
            <button className="page-link" onClick={nextPage}>
              <i className="bi bi-chevron-right"></i>
            </button>
          </li>
        </ul>
      </nav>
      </div>

      {/* Edit User Modal */}
      <div
        className="modal fade"
        id="editUserModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <form onSubmit={(e) => handleEditUser(e, editId)}>
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">Edit User</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label>Email</label>
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
                  <label>Full Name</label>
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
                  <label>Gender</label>
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
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" data-bs-dismiss="modal">
                  Cancel
                </button>
                <button className="btn btn-primary" type="submit">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
        
      </div>

      <div
        className="modal fade"
        id="staticBackdrop"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content" style={{ backgroundColor: "#e3f2fd" }}>
            <form onSubmit={handleNewUser}>
              <div
                className="modal-header"
                style={{ backgroundColor: "#bbdefb" }}
              >
                <h5 className="modal-title text-primary">Add New User</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                />
              </div>
              <div className="modal-body">
                {[
                  "userEmail",
                  "userName",
                  "userPassword",
                  "userRetypePassword",
                ].map((field, i) => (
                  <div className="mb-3" key={i}>
                    <label className="form-label">
                      {field.replace("user", "").replace(/([A-Z])/g, " $1")}
                    </label>
                    <input
                      type={field.includes("Password") ? "password" : "text"}
                      className="form-control"
                      name={field}
                    />
                  </div>
                ))}
                <div className="mb-3">
                  <label className="form-label">Select  gender</label>
                  <select className="form-control" name="userGender" required>
                    <option value="" disabled> Select Gender</option>
                    <option value="1">Male</option>
                    <option value="2">Female</option>
                    <option value="3">Others</option>
                  </select>
                </div>
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
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
