import React, { useRef, useState, useEffect, useContext } from "react";
import SearchBar from "./SearchBar";
import Category from "./Category";
import AuthContext from "../../context/AuthContext";

export default function Music() {
  const customRef = useRef(null);
  const [music, setMusic] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const { authTokens } = useContext(AuthContext);

  const handleSlide = (direction) => {
    if (customRef.current) {
      customRef.current.scrollBy({
        left: direction === "previous" ? -450 : 450,
        behavior: "smooth",
      });
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  useEffect(() => {
    const fetchMusic = async () => {
      try {
        const accessToken = authTokens?.access;

        const response = await fetch("http://127.0.0.1:8000/api/music/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(` Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Music Data:", data);

        if (Array.isArray(data)) {
          setMusic(data);
        } else {
          console.error("music from backend:", data);
          setMusic([]);
        }
      } catch (error) {
        console.error("Error :", error);
        setMusic([]);
      }
    };

    fetchMusic();
  }, [authTokens]);

  //for filtering and searching
  const filteredMusic = music.filter((item) => {
    const typeMusicMatch =
      selectedCategory === "All" || item.type_music === selectedCategory;

    const searchMatch =
      !searchQuery ||
      (item.type_music &&
        item.type_music.toLowerCase().includes(searchQuery.toLowerCase()));

    return typeMusicMatch && searchMatch;
  });

  return (
    <div>
      <div className="fw-bold pt-3 text-center mt-1">
        <h1>Music Recommendation</h1>
      </div>
      <div className="musicReco">
        <div className="musicBg py-2 rounded">
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
          />
          <Category
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
          <h4 className="text-start m-5 mb-0">Musics To Help You Calm Down</h4>
          <hr className="blue-line mx-4"></hr>

          <div className="top-music-list">
            <button
              className="carousel-control-prev btn-slide"
              type="button"
              id="prev-slide"
              onClick={() => handleSlide("previous")}
            >
              <i className="bi bi-arrow-left-circle-fill text-black fs-2"></i>
            </button>

            <div className="music-list" ref={customRef}>
              {filteredMusic.length > 0 ? (
                filteredMusic.slice(0, 5).map((item, index) => (
                  <div key={index} className="card recommend-music p-3">
                    <iframe
                      width="360"
                      height="315"
                      src={`https://www.youtube.com/embed/${item.music}`}
                      title="YouTube video player"
                      className="w-100 music-item"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    ></iframe>

                    <div className="category-name fw-lighter text-center rounded w-25">
                      {item.type_music}
                    </div>
                  </div>
                ))
              ) : (
                <div className="d-flex justify-content-center align-items-center mb-3">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              )}
            </div>

            <button
              className="carousel-control-next btn-slide"
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
