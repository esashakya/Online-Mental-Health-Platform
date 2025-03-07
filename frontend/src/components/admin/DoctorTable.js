import React from "react";
import {useState, useEffect, useContext} from "react";
import SearchBar from "../user/SearchBar";
import AuthContext from '../../context/AuthContext'


export default function DoctorTable() {
  const [doctors, setDoctor] = useState([]);
  
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
  const {registerNewDoctor} = useContext(AuthContext)
  const handleNewDoctor = async e => {
    // prevent refreshing the page
    e.preventDefault()  
    //gather the information from input tag
    const user_email = e.target.doctorEmail.value  
    const user_fullname = e.target.doctorName.value  
    const user_gender = e.target.doctorGender.value   
    const doctor_photo = e.target.picture.files[0]
    const doctor_type = e.target.type.value   
    const doctor_availableTime = e.target.availableTime.value 
    const doctor_degree = e.target.degree.value   
    const password = e.target.doctorPassword.value  
    const retype_password = e.target.doctorRetypePassword.value 
    const user_role = 3
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




    // check if user has entered 
    user_email.length > 0 && registerNewDoctor(formData)
    


  }
  return (
    <div>
      <div className="d-flex flex-column m-4">
        <SearchBar />
        <span className="fs-4 fw-semibold mt-2">
          All Registered Doctor Accounts
        </span>
        <hr className="line" />
        <div className="mt-4 text-center">
            <div className="AddNewUser ">
                <button className="btn btn-primary " data-bs-toggle="modal" data-bs-target="#staticBackdrop">Add New Doctors</button>
            </div>
            <div className="table-small">
          <table className="table  table-striped table-primary">
            <thead>
              <tr >
                
                <th scope="col">Id</th>
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
              {doctors.map((doctor)=>
              <tr key={doctor.id}>
                <td>{doctor.id}</td>
                <td>{doctor?.user?.user_email}</td>
                <td>{doctor?.user?.user_fullname }</td>
                <td>{doctor?.user?.user_gender }</td>
                <td>{doctor.doctor_photo}</td>
                <td><div className="badge bg-primary fw-normal fs-6">{doctor.doctor_type}</div></td>
                <td>{doctor.doctor_degree}</td>
                <td>{doctor.doctor_availableTime}</td>
                <td className="text-center">
                  <div className="d-flex flex-column justify-content-between">
                    <button className="btn btn-success w-100">Edit</button>
                    <button className="btn btn-danger w-100">Delete</button>
                  </div>
                </td>
                
              </tr>
               )}
              
            </tbody>
          </table>
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
                <form onSubmit={handleNewDoctor}>
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">Enter Doctor's Email</label>
                        <input type="text" className="form-control" name="doctorEmail" aria-required="true"/>
                        
                    </div>
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">Enter Doctor's Full Name</label>
                        <input type="text" className="form-control" name="doctorName" aria-required="true"/>
                        
                    </div>
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">Enter Doctor's password</label>
                        <input type="password" className="form-control" name="doctorPassword" aria-required="true"/>
                        
                    </div>
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">Retype Doctor's password</label>
                        <input type="password" className="form-control" name="doctorRetypePassword" aria-required="true"/>
                        
                    </div>
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">Enter Doctor's Gender</label>
                        
                        <select className="form-control" name="doctorGender">
                            <option disabled>Choose the doctor gender</option>
                            <option value="1">Male</option>
                            <option value="2">Female</option>
                            <option value="3">Others</option>


                        </select>
                        
                    </div>
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">Enter Picture</label>
                        <input type="file" className="form-control" name="picture" aria-required="true"/>
                        
                    </div>
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">Enter Doctor's Type</label>
                        <select className="form-control" name="type">
                            <option disabled>Choose the type of doctor</option>
                            <option value="1">Therapist</option>
                            <option value="2">Psychatrist</option>

                        </select>
                        
                    </div>
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">Enter Doctor's Highesh Degree</label>
                        <input type="text" className="form-control" name="degree" aria-required="true"/>
                        
                    </div>
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">Available</label>
                        <input type="time" className="form-control" name="availableTime" aria-required="true"/>
                        
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
