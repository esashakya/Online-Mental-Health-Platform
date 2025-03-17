import React, { useContext, useEffect, useState } from "react";
import useAxios from "../../utils/useAxios";
import AuthContext from '../../context/AuthContext';
const msg = require("sweetalert2");


export default function AppointmentList() {
  const [appointmentList, setAppointmentList] = useState(null);
  const apiAxios = useAxios();
  const {user} = useContext(AuthContext);

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
        console.log("Res:", response.data);
        setAppointmentList(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAppointments();
    const interval = setInterval(fetchAppointments, 5000); //refresh after 5 seconds to update the status accordingly

    return () => clearInterval(interval);
  }, []);

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      const response = await apiAxios.patch(`/appointments/${appointmentId}/`, {
        appointment_status: newStatus,
      });

      console.log("Status updated:", response);

      //notification
      if (newStatus === 4) {
        msg.fire({
          title: 'Appointment Approved!',
          text: `The appointment status has been changed to Approved.`,
          icon: 'success',
          confirmButtonText: 'Okay',
        });
      }

      setAppointmentList((prevList) =>
        prevList
          ? prevList.map((appointment) =>
              appointment.id === appointmentId
                ? { ...appointment, appointment_status: newStatus }
                : appointment
            )
          : []
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const getStatusColor = (status) => {
    const option = statusOptions.find((opt) => opt.value === status);
    return option ? option.colorClass : "";
  };

  return (
    <div className="container rounded p-5" style={{ backgroundColor: "#677bab" }}>
      <h3 className="text-center text-white">Current Appointments</h3>
      <table className="table table-striped table-hover">
        <thead className="text-center">
          <tr>
            <th scope="col">Sn.</th>
            <th scope="col">Doctor's Name</th>
            <th scope="col">Patient's Name</th>
            <th scope="col">Appointment Date</th>
            <th scope="col">Appointment Status</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {appointmentList && appointmentList.length > 0 ? (
            appointmentList.map((appointment, index) => (
              <tr key={appointment.id}>
                <th scope="row">{index + 1}</th>
                <td>{appointment.therapist_name}</td>
                <td>{appointment.user_fullname}</td>
                <td>{new Date(appointment.appointment_date).toLocaleString()}</td>
                <td>
                  <select
                    className={`form-select ${getStatusColor(appointment.appointment_status)}`}
                    value={appointment.appointment_status}
                    disabled={user.user_role === 1} //patient can not change status
                    onChange={(e) => {
                      const selectedStatus = parseInt(e.target.value); //integer
                      handleStatusChange(appointment.id, selectedStatus);
                    }}
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value} className={option.colorClass}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No appointments
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
