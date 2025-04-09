import React, { useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";

const msg = require("sweetalert2");
const AppointmentForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { slotId, startTime, endTime } = location.state || {};

  const [paymentStatus, setPaymentStatus] = useState(null);
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [purchaseOrderId, setPurchaseOrderId] = useState("");
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
  });
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const status = queryParams.get("status");

    if (status === "Completed") {
      setPaymentStatus("Completed");
    } else {
      setPaymentStatus("Pending");
    }
  }, [location]);
  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/doctors/${id}`);
        const data = await response.json();
        setDoctor(data);
      } catch (error) {
        console.error("Error fetching doctor details:", error);
      }
    };

    fetchDoctorDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  useEffect(() => {
    // creating new purchaseid everytime the page is reloaded
    const uniqueId = `AN-${uuidv4()}`;
    setPurchaseOrderId(uniqueId);
  }, []);
  console.log("Value is", purchaseOrderId);
  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   console.log('Appointment Details:', formData);
  //   alert('Appointment submitted!');
  // };
  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/api/make/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: 500,
          purchase_order_id: purchaseOrderId,
          return_url: window.location.href,
        }),
      });

      const responseData = await response.json();

      if (response.ok && responseData.status === "success") {
        window.location.href = responseData.payment_url;
      } else {
        msg.fire({
          title: "Payment Unsuccessful",
          text: "Something went wrong. Please try again.",
          icon: "error",
          confirmButtonText: "Try again",
          background: "#dc3545",
          color: "#fff",
        });
      }
    } catch (error) {
      console.error("Error during payment initiation:", error);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (paymentStatus !== "Completed") {
      msg.fire({
        title: "Payment not completed!",
        text: "Please complete the payment before submitting the appointment.",
        icon: "error",
        confirmButtonText: "Okay",
        background: "#dc3545",
        color: "#fff",
      });
      return;
    }
    const appointmentData = {
      user_id: user?.user_id,
      doctor_id: parseInt(id, 10),
      slot_id: slotId,
      date_time: formData.date,
    };

    console.log(appointmentData);
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/api/book/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(appointmentData),
      });
      setLoading(false);
      const result = await response.json();
      console.log("API Response:", result);

      if (response.ok) {
        msg.fire({
          title: "Appointment registered successfully.!",
          text: "You will get confirmation email about your appointment shortly.",
          icon: "success",
          confirmButtonText: "Okay",
          background: "#28a745",
          color: "#fff",
        });
        setFormData({
          name: "",
          email: "",
          phone: "",
          date: "",
          time: "",
        });
        setPaymentStatus(null);
        navigate("/Doctor");
      } else {
        msg.fire({
          title: "Something went wrong. Please try again.",
          text: "Invalid data field, please check your entered data is correct or not",
          icon: "error",
          confirmButtonText: "Try again",
          background: "#dc3545",
          color: "#fff",
        });
      }
    } catch (error) {
      console.error("Error submitting appointment:", error);
      msg.fire({
        title: "Oops!Server error",
        text: "Sorry for inconvenience. Please try again in few minutes",
        icon: "error",
        confirmButtonText: "Try Again",
        background: "#dc3545",
        color: "#fff",
      });
    }
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
          <label htmlFor="name" className="form-label">
            Doctor's Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={doctor.user?.user_fullname || "Loading..."}
            disabled
          />
        </div>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Full Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
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
            name="email"
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
          />
        </div>
        <div className="mb-3">
          <label htmlFor="time" className="form-label">
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

        <div className="mb-3">
          <label htmlFor="date" className="form-label">
            Appointment Fee
          </label>
          <input
            type="text"
            className="form-control"
            name="fee"
            value="Rs.500"
            disabled
          />
        </div>
        <div className="mb-3">
          <label htmlFor="time" className="form-label">
            Appointment Time
          </label>
          <p className="text-primary">
            {" "}
            You will get notified soon about your appointment time. Please be
            patient with us.
          </p>
        </div>
        <div className="mb-3">
          <button
            type="button"
            className="btn bg-primary-subtle text-primary-emphasis"
            onClick={handlePayment}
          >
            Pay with Khalti
          </button>
        </div>
        <button type="submit" className="btn btn-primary d-flex ms-auto">
          Submit Appointment
        </button>
      </form>
    </div>
  );
};

export default AppointmentForm;
