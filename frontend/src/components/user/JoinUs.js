import React, { useEffect } from "react";

export default function JoinUs() {
  useEffect(() => {
    const textElements = document.querySelectorAll(".text");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          } else {
            entry.target.classList.remove("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    textElements.forEach((text) => {
      observer.observe(text);
    });

    return () => {
      textElements.forEach((text) => {
        observer.unobserve(text);
      });
    };
  }, []);

  return (
    <div className=" mt-5 d-flex flex-row align-items-center join-us">
      <div className="image-doctor d-flex justify-content-center col-md-4">
        <img
          src="http://localhost:8000/media/join.png"
          alt="image"
          className="img-fluid"
        />
      </div>
      <div className="col-md-7 col-12 m-5 d-flex flex-column">
        <div>
          <h1 className="text-center text">Join Our Team</h1>
        </div>
        <div className="text">
          We are always looking for passionate and qualified mental health
          professionals to join our platform and help make a difference. Our
          mission is to provide accessible, high-quality mental health services
          to people everywhere, and we need your expertise to make that happen.
          <br />
          <br />
          As part of our network, you'll have the opportunity to work with
          individuals who truly need your support. We aim to connect you with
          patients seeking guidance, therapy, and a safe space to address their
          mental health challenges. Whether you specialize in therapy,
          counseling, or psychiatry, we welcome professionals from all fields to
          be part of our diverse community.
          <br />
          <br />
          <p className="text-success text">
            To apply, please send your CV along with your qualifications and any
            necessary documents to the email below. Our admin team will review
            your information and get back to you as soon as possible.
          </p>
          <div className="d-flex justify-content-center">
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=finalyay1111@gmail.com"
              className="btn btn-primary"
            >
              Apply Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
