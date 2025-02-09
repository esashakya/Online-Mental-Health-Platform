import React from "react";
import SearchBar from "../user/SearchBar";

export default function AdminAppointment() {
  return (
    <div>
      <div className="d-flex flex-column m-4">
        <SearchBar />
        <span className="fs-4 fw-semibold mt-2">
          All Scheduled Appointments
        </span>
        <hr className="line" />
        <div className="mt-4 text-center">
            <div className="AddNewUser ">
                <button className="btn btn-primary " data-bs-toggle="modal" data-bs-target="#staticBackdrop">Add New Appointments</button>
            </div>
            <div className="table-small">
          <table className="table  table-striped table-primary">
            <thead>
              <tr>
                <th scope="col">Sn</th>
                <th scope="col">Id</th>
                <th scope="col">Patient Name</th>
                <th scope="col">Patient Email Address</th>
                <th scope="col">Doctor Name</th>
                <th scope="col">Doctor Email Address</th>
                <th scope="col">Total Time(in mins)</th>
                <th colSpan="2">Make Changes</th>

              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">1</th>
                <td>0122</td>
                <td>Esa Shakya</td>
                <td>esa@gmail.com</td>
                <td>Dr. Esa Shakya</td>
                <td>esa@gmail.com</td>
                <td>50</td>
                <td><button className="btn btn-success">Edit</button></td>
                <td><button className="btn btn-danger">Delete</button></td>
              </tr>
              <tr>
                <th scope="row">1</th>
                <td>0122</td>
                <td>Esa Shakya</td>
                <td>esa@gmail.com</td>
                <td>Dr. Esa Shakya</td>
                <td>esa@gmail.com</td>
                <td>50</td>
                <td><button className="btn btn-success">Edit</button></td>
                <td><button className="btn btn-danger">Delete</button></td>
              </tr>
              <tr>
                <th scope="row">1</th>
                <td>0122</td>
                <td>Esa Shakya</td>
                <td>esa@gmail.com</td>
                <td>Dr. Esa Shakya</td>
                <td>esa@gmail.com</td>
                <td>50</td>
                <td><button className="btn btn-success">Edit</button></td>
                <td><button className="btn btn-danger">Delete</button></td>
              </tr>
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
                <form>
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">Enter Patient's Email</label>
                        <input type="text" className="form-control" aria-required="true"/>
                        
                    </div>
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">Enter Patient's Full Name</label>
                        <input type="text" className="form-control" aria-required="true"/>
                        
                    </div>
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">Enter Doctor's Email</label>
                        <input type="text" className="form-control" aria-required="true"/>
                        
                    </div>
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">Enter Doctor's Full Name</label>
                        <input type="text" className="form-control" aria-required="true"/>
                        
                    </div>
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">Enter Chosen Time</label>
                        <select className="form-control">
                            <option disabled>Choose the type of doctor</option>
                            <option value="50">50 mins</option>
                            <option value="80">80mins</option>

                        </select>
                        
                    </div>
                    
                </form>
            </div>
            <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" className="btn btn-primary">Post</button>
            </div>
            </div>
        </div>
        </div>
      </div>
    </div>
  );
}
