import React from "react";
import SearchBar from "./SearchBar";

export default function Music() {
  return (
    <div>
      <div className="fw-bold pt-3 text-center mt-4">
        <h1>Music Recommendation</h1>
      </div>
      <div className="container musicBg py-2 rounded">
        <SearchBar />
        <h4 className="text-start m-5 mb-0">Top 5 most played sounds</h4>
        <hr className="blue-line mx-4"></hr>
        <div id="carouselExample" className="carousel slide">
          <div className="carousel-inner">
            <div className="carousel-item active">
              <div className="music-card  d-flex flex-row justify-content-center p-5">
                <div className="card col-12 col-sm-6 col-md-4 mx-2 p-4 recommend-music">
                  <img
                    src="http://localhost:8000/media/cover1.png"
                    alt="Cover"
                  ></img>
                  <div className="pause-music">
                    <i className="bi bi-play-fill fs-1"></i>
                  </div>
                  <div className="category-name fw-lighter text-center rounded">
                    OCD
                  </div>
                </div>
                <div className="card col-12 col-sm-6 col-md-4 mx-2 p-4 recommend-music">
                  <img
                    src="http://localhost:8000/media/cover2.png"
                    alt="Cover"
                  ></img>
                  <div className="pause-music">
                    <i className="bi bi-play-fill fs-1"></i>
                  </div>
                  <div className="category-name fw-lighter text-center rounded">
                    Anxiety
                  </div>
                </div>
                <div className="card col-12 col-sm-6 col-md-4 mx-2 p-4 recommend-music">
                  <img
                    src="http://localhost:8000/media/cover3.png"
                    alt="Cover"
                  ></img>
                  <div className="pause-music">
                    <i className="bi bi-play-fill fs-1"></i>
                  </div>
                  <div className="category-name fw-lighter text-center rounded">
                    Anxiety
                  </div>
                </div>
              </div>
            </div>
            {/* for other music  */}
            <div className="carousel-item">
              <div className="music-card  d-flex flex-row  p-5">
                <div className="card col-12 col-sm-6 col-md-4 mx-2 p-4 recommend-music">
                  <img
                    src="http://localhost:8000/media/cover1.png"
                    alt="Cover"
                  ></img>
                  <div className="category-name fw-lighter text-center rounded">
                    Anxiety
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button
            className="carousel-control-prev btn-dark"
            type="button"
            data-bs-target="#carouselExample"
            data-bs-slide="prev"
          >
            <i className="bi bi-arrow-left-circle-fill text-black fs-2"></i>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExample"
            data-bs-slide="next"
          >
            <i className="bi bi-arrow-right-circle-fill text-black fs-2"></i>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>
    </div>
  );
}
