import React from "react";
import SearchBar from "../user/SearchBar";

export default function UserTable() {
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
                <th scope="col">Sn</th>
                <th scope="col">User Id</th>
                <th scope="col">User Email</th>
                <th scope="col">Full Name</th>
                <th scope="col">User Gender</th>
                <th scope="col">User Age</th>
                <th colSpan="2">Make Changes</th>

              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">1</th>
                <td>0122</td>
                <td>Esa@gmail.com</td>
                <td>esa</td>
                <td>Female</td>
                <td>20</td>
                <td><button className="btn btn-success">Edit</button></td>
                <td><button className="btn btn-danger">Delete</button></td>
              </tr>
              <tr>
                <th scope="row">2</th>
                <td>0122</td>
                <td>Esa@gmail.com</td>
                <td>esa</td>
                <td>Female</td>
                <td>20</td>
                <td><button className="btn btn-success">Edit</button></td>
                <td><button className="btn btn-danger">Delete</button></td>
              </tr>
              <tr>
                <th scope="row">3</th>
                <td>0122</td>
                <td>Esa@gmail.com</td>
                <td>esa</td>
                <td>Female</td>
                <td>20</td>
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
                        <label htmlFor="title" className="form-label">Enter User's Email</label>
                        <input type="text" className="form-control" aria-required="true"/>
                        
                    </div>
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">Enter User's Full Name</label>
                        <input type="text" className="form-control" aria-required="true"/>
                        
                    </div>
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">Enter User's Gender</label>
                        <input type="text" className="form-control" aria-required="true"/>
                        
                    </div>
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">Enter User's Age</label>
                        <input type="number" className="form-control" aria-required="true"/>
                        
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
