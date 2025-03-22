import React, { useContext, useEffect, useState } from "react";
import useAxios from "../../utils/useAxios";
import AuthContext from '../../context/AuthContext';
import msg from "sweetalert2";
import DatePicker from "react-datepicker"; //datepicker
import "react-datepicker/dist/react-datepicker.css";
import {Link} from 'react-router-dom'



export default function AppointmentList() {
  const [appointmentList, setAppointmentList] = useState(null);
  const [selectedDateAppointment, setSelectedDateAppointment] = useState(null);  //for filtering the appointments according to status
  const [filteredStatus, setFilteredStatus] = useState(null);
  const [newDateTime, setNewDateTime] = useState(new Date());
  const apiAxios = useAxios();
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("authTokens")

  

  const statusOptions = [
    { value: 1, label: "In Call", colorClass: "bg-primary-subtle text-primary-emphasis" },
    { value: 2, label: "Pending", colorClass: "bg-warning-subtle text-warning-emphasis" },
    { value: 3, label: "Not Attended", colorClass: "bg-danger-subtle text-danger-emphasis" },
    { value: 4, label: "Approved", colorClass: "bg-info-subtle text-info-emphasis" },
    { value: 5, label: "Completed", colorClass: "bg-success-subtle text-success-emphasis" },
  ];

  useEffect(() => {
    
    const fetchAppointments = async () => {
      try {
        const response = await apiAxios.get("/appointments/");
        setAppointmentList(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAppointments();
    const interval = setInterval(fetchAppointments, 5000); // Refresh  5 seconds

    return () => clearInterval(interval);
    
  }, []);
  
  const isTodayAppointment = () => {
    console.log(appointmentList);
    if (!appointmentList || appointmentList.length === 0) return false;

    //  YYYY-MM-DD in present
    const today = new Date().toISOString().split("T")[0];

    //checking the date
    return appointmentList.some((appointment) => {
      const appointmentDate = new Date(appointment.appointment_date)
        .toISOString()
        .split("T")[0];
      
      return appointmentDate === today && appointment.appointment_status !== 5;
    });
    
  };
  if (isTodayAppointment()) {
    console.log("there is an appointment");
  }
  
  
  
  const filteredAppointments = appointmentList
    ? appointmentList.filter((appointment) =>
        filteredStatus !== null ? appointment.appointment_status === filteredStatus : true      
      )
    : [];

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      await apiAxios.patch(`/appointments/${appointmentId}/`, {
        appointment_status: newStatus,
      });

      setAppointmentList((prevList) =>
        prevList.map((appointment) =>
          appointment.id === appointmentId
            ? { ...appointment, appointment_status: newStatus }
            : appointment
        )
      );

      if (newStatus === 4) {
        msg.fire({
          title: "Appointment Approved!",
          text: `The appointment has been approved.`,
          icon: "success",
          confirmButtonText: "Okay",
        });
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleReschedule = async () => {
    if (!selectedDateAppointment) return;

    try {
      await apiAxios.patch(`/appointments/${selectedDateAppointment.id}/`, {
        appointment_date: newDateTime.toISOString(),
      });

      setAppointmentList((prevList) =>
        prevList.map((appointment) =>
          appointment.id === selectedDateAppointment.id
            ? { ...appointment, appointment_date: newDateTime }
            : appointment
        )
      );
      
      msg.fire({
        title: "Appointment Rescheduled!",
        text: `The appointment date has been updated.`,
        icon: "success",
        confirmButtonText: "Okay",
      });

      setSelectedDateAppointment(null);
    } catch (error) {
      console.error("Error rescheduling:", error);
    }
  };

  return (
    <div className="container rounded p-5" style={{ backgroundColor: "#677bab" }}>
      <h3 className="text-center text-white">Current Appointments</h3>
      <div className="d-flex justify-content-center mb-3">
        {statusOptions.map((option) => (
          <button
            key={option.value}
            className={`btn mx-1 ${option.colorClass} ${filteredStatus === option.value ? "fw-bold border border-dark" : ""}`}
            onClick={() => setFilteredStatus(option.value)}
          >
            {option.label}
          </button>
        ))}
        {isTodayAppointment() && (
                  <button
                    type="button"
                    class="btn bg-primary-subtle text-primary-emphasis position-relative ms-auto mt-2 float-end" 
                  >
                    <Link  className="text-decoration-none" to = "/Appointment/CallLobby">Join Appointment</Link>
                    <span className="position-absolute top-0 start-100 translate-middle p-2 bg-danger border border-light rounded-circle">
                      <span className="visually-hidden">New Appointment</span>
                    </span>
                  </button>
                )}
      </div>
      
      <div style={{ maxHeight: "400px", overflowY: "auto" }}>
      
      <table className="table table-striped table-hover">
        <thead className="text-center">
          <tr>
            <th>Sn.</th>
            <th>Doctor's Name</th>
            <th>Patient's Name</th>
            <th>Appointment Date</th>
            <th>Appointment Status</th>
            {user.user_role === 3 && <th>Actions</th>}
          </tr>
        </thead>
        <tbody className="text-center">
          {filteredAppointments && filteredAppointments.length > 0 ? (
            filteredAppointments.slice(0, 10).map((appointment, index) => (
              <tr key={appointment.id}>
                <th>{index + 1}</th>
                <td>{appointment.therapist_name}</td>
                <td>{appointment.user_fullname}</td>
                <td>{new Date(appointment.appointment_date).toLocaleString()}</td>
                <td>
                  <select
                    className={`form-select ${statusOptions.find((opt) => opt.value === appointment.appointment_status)?.colorClass}`}
                    value={appointment.appointment_status}
                    disabled={user.user_role === 1}
                    onChange={(e) => handleStatusChange(appointment.id, parseInt(e.target.value))}
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </td>
                {user.user_role === 3 && (
                  <td>
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => {
                        setSelectedDateAppointment(appointment);
                        setNewDateTime(new Date(appointment.appointment_date)); 
                      }}
                    >
                      Reschedule
                    </button>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No appointments
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </div>
      {selectedDateAppointment && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Reschedule Appointment</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedDateAppointment(null)}></button>
              </div>
              <div className="modal-body text-center">
                <p>Select new date & time:</p>
                <DatePicker
                  selected={newDateTime}
                  onChange={(date) => setNewDateTime(date)}
                  showTimeSelect
                  dateFormat="Pp"
                  className="form-control"
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setSelectedDateAppointment(null)}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleReschedule}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
