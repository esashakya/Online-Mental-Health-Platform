import React, { useContext, useEffect, useState } from "react";
import useAxios from "../../utils/useAxios";
import AuthContext from '../../context/AuthContext';
import msg from "sweetalert2";
import DatePicker from "react-datepicker"; //to change the date swiftly
import "react-datepicker/dist/react-datepicker.css";

export default function AppointmentList() {
  const [appointmentList, setAppointmentList] = useState(null);
  const [selectedDateAppointment, setSelectedDateAppointment] = useState(null);
  const [newDateTime, setNewDateTime] = useState(new Date());
  const apiAxios = useAxios();
  const { user } = useContext(AuthContext);

  const statusOptions = [
    { value: 1, label: "In Call", colorClass: "bg-primary text-white" },
    { value: 2, label: "Pending", colorClass: "bg-warning text-dark" },
    { value: 3, label: "Not Attended", colorClass: "bg-danger text-white" },
    { value: 4, label: "Approved", colorClass: "bg-info text-dark" },
    { value: 5, label: "Completed", colorClass: "bg-success text-white" },
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
    const interval = setInterval(fetchAppointments, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, []);

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
          {appointmentList && appointmentList.length > 0 ? (
            appointmentList.map((appointment, index) => (
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
                      onClick={() => setSelectedDateAppointment(appointment)}
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
