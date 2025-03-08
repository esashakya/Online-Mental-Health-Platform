import React, { useState, useEffect, useContext } from "react";
import SearchBar from "../user/SearchBar";
import AuthContext from "../../context/AuthContext";
const msg = require("sweetalert2");

export default function UserTable() {
    const [users, setUser] = useState([]);
    const [editId, setEditId] = useState(null);
    const [newData, setNewData] = useState({user_email: "",
        user_fullname: "",
        user_gender: "",
        password:""});
    useEffect(() => {
        const fetchUsers = async () => {
          try {
            const response = await fetch("http://127.0.0.1:8000/api/users/");
            const data = await response.json();
            console.log("users:", data);
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
    
    
    if (!user_email || !user_fullname || !user_gender || !password || !retype_password) {
      msg.fire({
        title: "All fields are required!",
        icon: "error",
        toast: true,
        timer: 5000,
        position: "top-right",
        timerProgressBar: true,
        showConfirmButton: false,
        background: "#dc3545",
        color: "#ffffff",
      });
      return; // Stop 
    }
  
    if (password !== retype_password) {
      msg.fire({
        title: "Passwords do not match. Please try again",
        icon: "error",
        toast: true,
        timer: 5000,
        position: "top-right",
        timerProgressBar: true,
        showConfirmButton: false,
        background: "#dc3545",
        color: "#ffffff",
      });
      return; // Stop 
    }
  
    const formData = new FormData();
    formData.append("user_fullname", user_fullname);
    formData.append("user_email", user_email);
    
    formData.append("user_gender", user_gender);
    formData.append("user_role", 1);  
    formData.append("password", password);
    formData.append("retype_password", retype_password);
  
    
    try {
      await addNewUser(formData);  //add new user
      
    } catch (error) {
      console.error("Error", error);
    }
  };
  // delete
  const handleDeleteBtn = async (pk) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/users/${pk}`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        throw new Error(`Error while deleting: ${response.status}`);
      }
      msg.fire({
        title: "Deletion Successful",
        icon: "success",
        toast: true,
        timer: 5000,
        position: "top-right",
        timerProgressBar: true,
        showConfirmButton: false,
        background: "#28a745",
        color: "#ffffff",
        text: "Hope you have a great day!",
        didOpen: () => {
          msg.showLoading();
        },
        willClose: () => {
          msg.hideLoading();
          
        }})
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
    
    // get the data of chosen user
    const currentUser = users.find((user) => user.id === userId);
    
  
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
   
    
  
    // updatedData only stores the data which was edited
    if (
      updatedData.has("user_email") ||
      updatedData.has("user_fullname") ||
      updatedData.has("user_gender") 
      
    ) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/users/${userId}`, {
          method: "PUT",
          body: updatedData,
        });
        
        const data = await response.json();
        console.log("Response status:", response.status);
        console.log("Response data:", data);
        console.log(updatedData);

  
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
  return (
    <div>
      <div className="d-flex flex-column m-4">
        <SearchBar />
        <span className="fs-4 fw-semibold mt-2">
          All Registered User Accounts
        </span>
        <hr className="line" />
        <div className="mt-4 text-center">
            <div className="AddNewUser ">
                <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop">Add New User</button>
            </div>
            <div className="table-small">
          <table className="  table  table-striped table-primary">
            <thead>
              <tr>
                <th scope="col">User Id</th>
                <th scope="col">User Email</th>
                <th scope="col">Full Name</th>
                <th scope="col">User Gender</th>
                <th scope="col">User Role</th>
               
                <th colSpan="2">Make Changes</th>

              </tr>
            </thead>
            <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <th>{user.id}</th>
                <td>{user.user_email}</td>
                <td>{user.user_fullname}</td>
                <td>{user.user_gender}</td>
                <td>Normal User</td>
                

                <td><button className="btn btn-success" onClick={() => handleEditBtn(user)}
                          data-bs-toggle="modal"
                          data-bs-target="#editUserModal">Edit</button></td>
                <td><button className="btn btn-danger" onClick={() => handleDeleteBtn(user.id)}>Delete</button></td>
              </tr>
            ))}
            </tbody>
          </table>
          </div>
        </div>
        <div
          className="modal fade"
          id="editUserModal"
          tabIndex="-1"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit User Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={(e) => handleEditUser(e, editId)}>
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
        <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content" style={{backgroundColor: "#e3f2fd"}}>
            <div className="modal-header " style={{backgroundColor: "#bbdefb"}}>
                <h1 className="modal-title fs-5" id="exampleModalLabel" style={{color: "#0d47a1"}}>Fill the contents below</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
                <form onSubmit={handleNewUser}>
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">Enter User's Email</label>
                        <input type="text" className="form-control" aria-required="true" name="userEmail"/>
                        
                    </div>
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">Enter User's Full Name</label>
                        <input type="text" className="form-control" aria-required="true" name="userName"/>
                        
                    </div>
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">Enter User's Gender</label>
                        <input type="text" className="form-control" aria-required="true" name="userGender"/>
                        
                    </div>
          
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">Enter User's password</label>
                        <input type="password" className="form-control" aria-required="true" name="userPassword"/>
                        
                    </div>
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">Retype User's password</label>
                        <input type="password" className="form-control" aria-required="true" name="userRetypePassword"/>
                        
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                      <button type="submit" className="btn btn-primary">Post</button>
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
