import React, { useContext, useEffect, useState } from "react";
import useAxios from "../../utils/useAxios";
import AuthContext from "../../context/AuthContext";
import msg from "sweetalert2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link } from "react-router-dom";

export default function AppointmentList() {
  const [appointmentList, setAppointmentList] = useState(null);
  const [selectedDateAppointment, setSelectedDateAppointment] = useState(null);
  const [filteredStatus, setFilteredStatus] = useState(null);
  const [newDateTime, setNewDateTime] = useState(new Date());
  const [dateFilter, setDateFilter] = useState({
    startDate: null,
    endDate: null,
  });
  const [filterByDate, setFilterByDate] = useState(false);

  const apiAxios = useAxios();
  const { user } = useContext(AuthContext);

  const statusOptions = [
    {
      value: 2,
      label: "Pending",
      colorClass: "bg-warning-subtle text-warning-emphasis",
    },
    {
      value: 1,
      label: "Completed",
      colorClass: "bg-primary-subtle text-primary-emphasis",
    },
    {
      value: 3,
      label: "Not Attended",
      colorClass: "bg-danger-subtle text-danger-emphasis",
    },
    {
      value: 4,
      label: "Approved",
      colorClass: "bg-info-subtle text-info-emphasis",
    },
    {
      value: 5,
      label: "Confirmed",
      colorClass: "bg-success-subtle text-success-emphasis",
    },
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
    const interval = setInterval(fetchAppointments, 5000);
    return () => clearInterval(interval);
  }, []);

  const isTodayAppointment = () => {
    if (!appointmentList) return false;
    const today = new Date().toISOString().split("T")[0];
    return appointmentList.some((appt) => {
      const date = new Date(appt.appointment_date).toISOString().split("T")[0];
      return date === today && appt.appointment_status !== 1 && appt.appointment_status !== 3 && appt.appointment_status !== 4  && appt.appointment_status !== 2;
    });
  };

  const handleDateFilterChange = (dates) => {
    const [start, end] = dates;
    setDateFilter({ startDate: start, endDate: end });
  };

  const toggleDateFilter = () => {
    setFilterByDate(!filterByDate);
    if (filterByDate) setDateFilter({ startDate: null, endDate: null });
  };

  const filteredAppointments =
    appointmentList?.filter((appt) => {
      const statusMatch =
        filteredStatus !== null
          ? appt.appointment_status === filteredStatus
          : true;
      const dateMatch =
        filterByDate && dateFilter.startDate && dateFilter.endDate
          ? new Date(appt.appointment_date) >= dateFilter.startDate &&
            new Date(appt.appointment_date) <= dateFilter.endDate
          : true;
      return statusMatch && dateMatch;
    }) || [];

  const handleStatusChange = async (id, newStatus) => {
    try {
      await apiAxios.patch(`/appointments/${id}/`, {
        appointment_status: newStatus,
      });
      setAppointmentList((prev) =>
        prev.map((appt) =>
          appt.id === id ? { ...appt, appointment_status: newStatus } : appt
        )
      );

      if (newStatus === 4) {
        msg.fire({
          title: "Appointment Approved!",
          text: "The appointment has been approved.",
          icon: "success",
          confirmButtonText: "Okay",
        });
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const formatAppointmentDateTime = (dateString) => {
    const date = new Date(dateString);
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return date.toLocaleString("en-US", options);
  };

  const handleReschedule = async () => {
    if (!selectedDateAppointment) return;
    try {
      await apiAxios.patch(`/appointments/${selectedDateAppointment.id}/`, {
        appointment_date: newDateTime.toISOString(),
      });

      setAppointmentList((prevList) =>
        prevList.map((appt) =>
          appt.id === selectedDateAppointment.id
            ? { ...appt, appointment_date: newDateTime }
            : appt
        )
      );

      msg.fire({
        title: "Appointment Rescheduled!",
        text: "The appointment date has been updated.",
        icon: "success",
        confirmButtonText: "Okay",
      });

      setSelectedDateAppointment(null);
    } catch (error) {
      console.error("Error rescheduling:", error);
    }
  };

  return (
    <div className="container py-5">
      <div className="bg-light rounded shadow-sm ">
        <div
          className="card-header bg-gradient py-3 mb-2"
          style={{ backgroundColor: "#3a4a6d" }}
        >
          <h3 className="text-center text-white mb-0 fw-bold">
            <i className="bi bi-calendar-check me-2"></i>
            Current Appointments
          </h3>
        </div>

        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2 p-4">
          <div className="d-flex flex-wrap gap-2">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                className={`btn btn-sm ${option.colorClass} ${
                  filteredStatus === option.value
                    ? "fw-bold border border-dark"
                    : ""
                }`}
                onClick={() => setFilteredStatus(option.value)}
              >
                {option.label}
              </button>
            ))}
            <button
              className={`btn btn-sm ${
                filterByDate ? "btn-outline-primary" : "btn-outline-secondary"
              }`}
              onClick={toggleDateFilter}
            >
              {filterByDate ? "Clear Date Filter" : "Filter by Date"}
            </button>
          </div>

          {isTodayAppointment() && (
            <Link
              to="/Appointment/CallLobby"
              className="btn btn-outline-danger position-relative"
            >
              Join Appointment
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                !
              </span>
            </Link>
          )}
        </div>

        <div className="row align-items-end mb-3">
          {filterByDate && (
            <div className="col-12 col-sm-auto mb-2 mb-sm-0 ms-3">
              <label className="form-label fw-semibold me-1">
                Select Date Range:
              </label>
              <DatePicker
                selectsRange
                startDate={dateFilter.startDate}
                endDate={dateFilter.endDate}
                onChange={handleDateFilterChange}
                isClearable={true}
                className="form-control"
                placeholderText="Select a date range"
              />
            </div>
          )}

          {(filteredStatus !== null || filterByDate) && (
            <div className="col-12 col-sm-auto ms-5">
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => {
                  setFilteredStatus(null);
                  setFilterByDate(false);
                  setDateFilter({ startDate: null, endDate: null });
                }}
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>

        <div
          className="table-responsive"
          style={{ maxHeight: "500px", overflowY: "auto" }}
        >
          <table className="table table-hover table-striped align-middle ">
            <thead className="table-light text-center">
              <tr>
                <th>Sn.</th>
                <th>Doctor</th>
                <th>Patient</th>
                <th>Date & Time</th>
                <th>Status</th>
                {user.user_role === 3 && <th>Actions</th>}
              </tr>
            </thead>
            <tbody className="text-center">
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((appt, index) => (
                  <tr key={appt.id}>
                    <td>{index + 1}</td>
                    <td>{appt.therapist_name}</td>
                    <td>{appt.user_fullname}</td>
                    <td>{formatAppointmentDateTime(appt.appointment_date)}</td>
                    <td>
                      <select
                        className={`form-select form-select-sm ${
                          statusOptions.find(
                            (opt) => opt.value === appt.appointment_status
                          )?.colorClass || ""
                        }`}
                        value={appt.appointment_status}
                        disabled={user.user_role === 1}
                        onChange={(e) =>
                          handleStatusChange(appt.id, parseInt(e.target.value))
                        }
                      >
                        {statusOptions
                          .filter((option) => {
                            
                            if (option.value === appt.appointment_status)
                              return true;

                           
                            if (user.user_role === 3) {
                              return option.value === 3 || option.value === 4 || option.value === 1;
                            }

                            
                            return true;
                          })
                          .map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                      </select>
                    </td>
                    {user.user_role === 3 && (
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => {
                            setSelectedDateAppointment(appt);
                            setNewDateTime(new Date(appt.appointment_date));
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
                  <td colSpan="6" className="text-muted text-center py-3">
                    No appointments match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedDateAppointment && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow">
              <div className="modal-header">
                <h5 className="modal-title">Reschedule Appointment</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedDateAppointment(null)}
                ></button>
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
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setSelectedDateAppointment(null)}
                >
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
