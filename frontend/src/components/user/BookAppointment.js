import React, { useContext, useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import Swal from "sweetalert2";

const AppointmentForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { slotId, startTime, endTime } = location.state || {};
  const { authTokens, user } = useContext(AuthContext);
  const accessToken = authTokens?.access;
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [isAvailable, setIsAvailable] = useState(false);
  const [availabilityChecked, setAvailabilityChecked] = useState(false);

  const [formData, setFormData] = useState({
    date: "",
  });

  // fetching the specific doctor detail
  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/doctors/${id}`);
        const data = await response.json();
        setDoctor(data);
      } catch (error) {
        console.error("Error fetching doctor details:", error);
        showError("Failed to load doctor information");
      }
    };

    fetchDoctorDetails();
  }, [id]);

  // the availability of time is checked when date is selected
  useEffect(() => {
    const checkAvailability = async () => {
      if (formData.date && doctor && startTime) {
        try {
          setLoading(true);
          const dateTime = new Date(`${formData.date}T${startTime}`);

          const available = await checkSlotAvailability(doctor.id, dateTime);
          setIsAvailable(available);
          setAvailabilityChecked(true);

          if (!available) {
            showWarning(
              "This time slot is no longer available. Please choose another time."
            );
          }
        } catch (error) {
          console.error("Availability check failed:", error);
          showError("Failed to check availability");
        } finally {
          setLoading(false);
        }
      }
    };

    checkAvailability();
  }, [formData.date, doctor, startTime]);

  const checkSlotAvailability = async (therapistId, slotDateTime) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/appointments/check_availability/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            therapist_id: therapistId,
            appointment_date: slotDateTime.toISOString(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to check availability");
      }

      const data = await response.json();
      return data.available;
    } catch (error) {
      console.error("Error checking availability:", error);
      throw error;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    //changing dynamically when date changes
    if (name === "date") {
      setIsAvailable(false);
      setAvailabilityChecked(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!availabilityChecked) {
      showWarning("Please select a date and wait for availability check");
      return;
    }
    
    if (!isAvailable) {
      showWarning("This time slot is no longer available. Please choose another time.");
      return;
    }
  
    if (!formData.date || !startTime) {
      showWarning("Please select both date and time");
      return;
    }
  
    try {
     
      const [hours, minutes] = startTime.split(':');
      const appointmentDate = new Date(formData.date);
      
     
      appointmentDate.setHours(parseInt(hours, 10));
      appointmentDate.setMinutes(parseInt(minutes, 10));
      appointmentDate.setSeconds(0);
      
    
      const isoString = appointmentDate.toISOString();
      
      
      
      console.log("Formatted date:", isoString); 
  
      const appointmentData = {
        user_id: user?.user_id,
        therapist_id: parseInt(id, 10),
        appointment_date: isoString,
        appointment_status: 2, 
      };
  
      setLoading(true);
      const response = await fetch("http://127.0.0.1:8000/api/book/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(appointmentData),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        showSuccess("Appointment booked successfully!");
        navigate("/Doctor");
      } else {
        const errorMsg = result.detail || result.message || "Failed to book appointment";
        console.error("Backend error:", result);
        showError(errorMsg);
      }
    } catch (error) {
      console.error("Error handling date/time:", error);
      showError("Invalid date/time selection. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (message) => {
    Swal.fire({
      title: "Success!",
      text: message,
      icon: "success",
      confirmButtonText: "OK",
    });
  };

  const showError = (message) => {
    Swal.fire({
      title: "Error!",
      text: message,
      icon: "error",
      confirmButtonText: "OK",
    });
  };

  const showWarning = (message) => {
    Swal.fire({
      title: "Warning!",
      text: message,
      icon: "warning",
      confirmButtonText: "OK",
    });
  };

  if (!doctor) {
    return (
      <div className="d-flex justify-content-center mb-3">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-3 fw-bold">Book an Appointment</h2>

      {loading && (
        <div className="d-flex justify-content-center mb-3">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="doctorName" className="form-label">
            Doctor's Name
          </label>
          <input
            type="text"
            className="form-control"
            id="doctorName"
            value={doctor.user?.user_fullname || "Loading..."}
            disabled
          />
        </div>

        <div className="mb-3">
          <label htmlFor="patientName" className="form-label">
            Your Name
          </label>
          <input
            type="text"
            className="form-control"
            id="patientName"
            value={user?.user_fullname || ""}
            disabled
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={user?.user_email || ""}
            disabled
          />
        </div>

        <div className="mb-3">
          <label htmlFor="date" className="form-label">
            Appointment Date
          </label>
          <input
            type="date"
            className="form-control"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            min={new Date().toISOString().split("T")[0]}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="timeSlot" className="form-label">
            Selected Time Slot
          </label>
          {startTime && endTime ? (
            <input
              type="text"
              className="form-control"
              value={`${startTime} - ${endTime}`}
              disabled
            />
          ) : (
            <p className="text-danger">
              No time slot selected. Please go back and select a slot.
            </p>
          )}
        </div>

        {availabilityChecked && (
          <div className="mb-3">
            <div
              className={`alert alert-${isAvailable ? "success" : "danger"}`}
            >
              {isAvailable
                ? "This time slot is available for booking"
                : "This time slot is no longer available"}
            </div>
          </div>
        )}

        <div className="mb-3">
          <label className="form-label">Appointment Fee</label>
          <input type="text" className="form-control" value="Rs.500" disabled />
        </div>

        <button
          type="submit"
          className="btn btn-primary d-flex ms-auto"
          disabled={loading || !isAvailable}
        >
          {loading ? "Processing..." : "Confirm Appointment"}
        </button>
      </form>
    </div>
  );
};

export default AppointmentForm;
