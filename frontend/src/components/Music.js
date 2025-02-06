import React, { useRef } from "react";
import SearchBar from "./SearchBar";
import Category from "./Category";
export default function Music() {
  const customRef = useRef(null);

  
  const handleSlide = (direction) => {
    if (customRef.current) {
      
      customRef.current.scrollBy({
        left: direction === "previous" ? -450 : 450,
        behavior: "smooth",
      });
    }
  };
  return (
    <div>
      <div className="fw-bold pt-3 text-center mt-1">
        <h1>Music Recommendation</h1>
      </div>
      <div className="musicReco">
        <div className=" musicBg py-2 rounded">
          <SearchBar />
          <Category/>
          <h4 className="text-start m-5 mb-0">Top 5 most played sounds</h4>
          <hr className="blue-line mx-4"></hr>
          
          <div className="top-music-list ">
            <button
              className="carousel-control-prev btn-slide"
              type="button"
              id="prev-slide"
              onClick={() => handleSlide("previous")}
            >
              <i className="bi bi-arrow-left-circle-fill text-black fs-2"></i>
            </button>

            <div className="music-list" ref={customRef}>
              <div className="card recommend-music p-3">
                <iframe
                  width="360"
                  height="315"
                  src="https://www.youtube.com/embed/_BtXPQimVhg?si=5JfVsAs5OeyQj6bp"
                  title="YouTube video player"
                  className="w-100 music-item"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>

                <div className="category-name fw-lighter text-center rounded">
                  OCD
                </div>
              </div>
              <div className="card  recommend-music p-3">
                <iframe
                  width="360"
                  height="315"
                  src="https://www.youtube.com/embed/QjDnjoaUJtI?si=ZifsWzLJEDeLPqNl"
                  title="YouTube video player"
                  className="w-100"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
                <div className="category-name fw-lighter text-center rounded">
                  Anxiety
                </div>
              </div>
              <div className="card  recommend-music p-3">
                <iframe
                  width="360"
                  height="315"
                  src="https://www.youtube.com/embed/kRn26hFq2VI?si=Ak2zld4wwg8k46A4&amp;controls=0"
                  title="YouTube video player"
                  className="w-100"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>

                <div className="category-name fw-lighter text-center rounded">
                  Anxiety
                </div>
              </div>
              <div className="card  recommend-music p-3">
                <iframe
                  width="360"
                  height="315"
                  title="YouTube video player"
                  src="https://www.youtube.com/embed/iwD9YHqcMPU?si=4MLA2YTGk-jn58rL"
                  className="w-100 music-item"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>

                <div className="category-name fw-lighter text-center rounded">
                  Panic
                </div>
              </div>
            </div>
            <button
              className="carousel-control-next  btn-slide"
              type="button"
              id="next-slide"
              onClick={() => handleSlide("nextMusic")}
            >
              <i className="bi bi-arrow-right-circle-fill text-black fs-2"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
