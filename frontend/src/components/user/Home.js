import React, { Component } from "react";
import Review from "./Review";
import { Link } from "react-router-dom";
export default function Home() {
  return (
    <div>
      <div className="homeImage">
        <div className="landingText text-center">
          <h2 className="mt-1">
            Welcome to <span style={{ color: "#3D52A0" }}>Untangle Chaos</span>{" "}
            - Your Safe Space for Mental Well-Being
          </h2>
          <br />
          <h5>
            Your mental health journey is important, and we are here to listen,
            support, and empower you.
            <br /> Explore our resources, find professional help, and discover
            ways to live your best life with mental wellness.
          </h5>
          <div className="mt-3 btn-lg text-center btn btn-primary">
            <Link
              to="/Doctor"
              style={{ color: "white", textDecoration: "none" }}
            >
              <h5>Book Your Appointment</h5>
            </Link>{" "}
          </div>
        </div>

        <img
          src="http://localhost:8000/media/homeee-1.png"
          className="img-fluid"
        ></img>
      </div>
      <Review />
      
    </div>
  );
}
