import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../../context/AuthContext";
import SearchBar from "../user/SearchBar";
const msg = require("sweetalert2");


export default function AdminMusic() {
  const [music, setMusic] = useState([]);
  const [editId, setEditId] = useState(null);
  const [moods, setMood] = useState([]);

  const { authTokens, addNewMusic } = useContext(AuthContext);
  const [newData, setNewData] = useState({
    music: "",
    type_music: "",
    mood_id: "",
  });
  const handleEditBtn = (music) => {
    setEditId(music.id);
    setNewData({
      music: music.music || "",
      type_music: music.type_music || "",
      mood_id: music.mood_id || "",
    });
  };
  const handleEdit = (e) => {
    const { name, value } = e.target;
    setNewData((prevData) => ({
      ...prevData,
      [name]: name === "mood_id" ? parseInt(value, 10) : value,
    }));
  };
  //add new msuic
  const handleNewMusic = async (e) => {
    // Prevent page refresh
    e.preventDefault();

    const music = e.target.music.value;
    const type_music = e.target.type.value;
    const mood_id = e.target.mood_id.value;

    const formData = new FormData();
    formData.append("music", music);
    formData.append("type_music", type_music);
    formData.append("mood_id", mood_id);

    addNewMusic(formData);
  };
  const handleEditMusic = async (e, musicId) => {
    e.preventDefault();

    const updatedData = new FormData();

    
    const currentMusic = music.find((music) => music.id === musicId);

   
    if (newData.music !== currentMusic?.music) {
      updatedData.append("music", newData.music);
    }
    
    if (newData.type_music !== currentMusic?.type_music) {
      updatedData.append("type_music", newData.type_music);
    }

    if (newData.mood_id !== currentMusic?.mood_id) {
      updatedData.append("mood_id", newData.mood_id);
    }
   

    
    if (
      updatedData.has("music") ||
      updatedData.has("type_music") ||
      updatedData.has("mood_id") 
    ) {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/musics/${musicId}`,
          {
            method: "PUT",
            body: updatedData,
          }
        );

        const data = await response.json();
        console.log("Response status:", response.status);
        console.log("Response data:", data);
        console.log(updatedData);

        if (!response.ok) {
          console.error("Update fail:", data);
        } else {
          console.log("success:", data);
          setMusic((prevMusic) =>
            prevMusic.map((m) =>
              m.id === musicId ? { ...m, mood_id: newData.mood_id } : m
            )
          );
          
          setMood((prevMoods) =>
            prevMoods.map((mood) =>
              mood.id === newData.mood_id ? { ...mood, type_mood: mood.type_mood } : mood
            )
          );
          window.location.reload();
        }

      } catch (error) {
        console.error("Error while editing:", error);
        
      }
    } else {
      console.log("No changes made");
    }
  };
  useEffect(() => {
    const accessToken = authTokens?.access;
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
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Music Data:", data);

        if (Array.isArray(data)) {
          setMusic(data);
        } else {
          console.error("API did not return an array:", data);
          setMusic([]);
        }
      } catch (error) {
        console.error("Error fetching music:", error);
        setMusic([]);
      }
    };
    const fetchMood = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/mood/", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            }});
        const data = await response.json();
        setMood(data);
        console.log(moods);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchMood();
    fetchMusic();
  }, []);
  // delete
    const handleDeleteBtn = async (pk) => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/musics/${pk}`, {
          method: "DELETE",
        });
  
        if (!response.ok) {
          throw new Error(`Error while deleting: ${response.status}`);
        }
        msg.fire({
          title: "Deletion Successful",
          icon: "success",
          toast: true,
          timer: 5000,
          position: "top-right",
          timerProgressBar: true,
          showConfirmButton: false,
          background: "#28a745",
          color: "#ffffff",
          text: "Hope you have a great day!",
          didOpen: () => {
            msg.showLoading();
          },
          willClose: () => {
            msg.hideLoading();
          },
        });
        setTimeout(() => {
          window.location.reload();
        }, 5000);
  
        setMusic((prev) => prev.filter((music) => music.id !== pk));
      } catch (error) {
        console.error("Error:", error);
      }
    };
  
  return (
    <div>
      <div>
        <div className="d-flex flex-column m-4">
          <SearchBar />
          <span className="fs-4 fw-semibold mt-2">All Registered Musics</span>
          <hr className="line" />
          <div className="mt-4 text-center">
            <div className="AddNewUser">
              <button
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#staticBackdrop"
              >
                Add New Music
              </button>
            </div>
            <div className="table-small">
              <table className="  table  table-striped table-primary">
                <thead>
                  <tr>
                    <th scope="col">Music Link</th>
                    <th scope="col">Type</th>
                    <th scope="col">Mood</th>

                    <th colSpan="2">Make Changes</th>
                  </tr>
                </thead>
                <tbody>
                  {music.map((m) => (
                    <tr key={m.id}>
                      <th>{m.music}</th>
                      <td>
                        <div
                          style={{
                            maxHeight: "150px",
                            overflowY: "auto",
                            whiteSpace: "normal",
                          }}
                        >
                          {m.type_music}
                        </div>
                      </td>
                      
                      <td>
                        {moods.find((mood) => mood.id === m.mood_id)
                          ?.type_mood || "Error"}
                      </td>

                      <td>
                        <button
                          className="btn btn-success"
                          onClick={() => handleEditBtn(m)}
                          data-bs-toggle="modal"
                          data-bs-target="#editUserModal"
                        >
                          Edit
                        </button>
                      </td>
                      <td>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDeleteBtn(m.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* to add */}
            <div
              className="modal fade"
              id="staticBackdrop"
              data-bs-backdrop="static"
              data-bs-keyboard="false"
              tabIndex="-1"
              aria-labelledby="staticBackdropLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div
                  className="modal-content"
                  style={{ backgroundColor: "#e3f2fd" }}
                >
                  <div
                    className="modal-header "
                    style={{ backgroundColor: "#bbdefb" }}
                  >
                    <h1
                      className="modal-title fs-5"
                      id="exampleModalLabel"
                      style={{ color: "#0d47a1" }}
                    >
                      Fill the contents below
                    </h1>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body">
                    <form onSubmit={handleNewMusic}>
                      <div className="mb-3">
                        <label htmlFor="title" className="form-label">
                          Enter Music Link:
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="music"
                          aria-required="true"
                        />
                      </div>

                      <div className="mb-3">
                        <label htmlFor="title" className="form-label">
                          Enter Music Category:
                        </label>
                        <select
                          className="form-control"
                          name="type"
                          onChange={handleEdit}
                        >
                          <option value="">Select Category</option>
                          {["Anxiety", "Panic", "Insomonia"].map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="mb-3">
                        <label htmlFor="title" className="form-label">
                          Enter Mood Id
                        </label>
                        <select
                          className="form-control"
                          name="mood_id"
                          value={newData.mood_id}
                          onChange={handleEdit}
                        >
                          <option value="">Select Mood</option>
                          {Array.isArray(moods) && moods.length > 0 ? (
                            moods.map((mood) => (
                              <option key={mood.id} value={mood.id}>
                                {mood.type_mood}
                              </option>
                            ))
                          ) : (
                            <option disabled>No moods available</option>
                          )}
                        </select>
                      </div>

                      <div className="modal-footer">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          data-bs-dismiss="modal"
                        >
                          Close
                        </button>
                        <button type="submit" className="btn btn-primary">
                          Post
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>

            </div>
            {/* to edit */}
            <div
              className="modal fade"
              id="editUserModal"
              tabIndex="-1"
              aria-hidden="true"
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Edit User Details</h5>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body">
                    <form onSubmit={(e) => handleEditMusic(e, editId)}>
                      <div className="mb-3">
                        <label className="form-label">Music Link</label>
                        <input
                          type="text"
                          name="music"
                          className="form-control"
                          value={newData.music}
                          onChange={handleEdit}
                          required
                        />
                      </div>
                      
                      <div className="mb-3">
                        <label className="form-label">Music Type</label>
                        <select
                          className="form-control"
                          name="mood_id"
                          value={newData.mood_id}
                          onChange={handleEdit}
                        >
                          <option value="">Select Mood</option>
                          {Array.isArray(moods) && moods.length > 0 ? (
                            moods.map((mood) => (
                              <option key={mood.id} value={mood.id}>
                                {mood.type_mood}
                              </option>
                            ))
                          ) : (
                            <option disabled>No moods available</option>
                          )}
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Category</label>
                        <select
                          className="form-control"
                          name="type_music"
                          value={newData.type_music}
                          onChange={handleEdit}
                        >
                          
                          <option value="">Select Category</option>
                          {["Anxiety", "Panic", "Insomonia"].map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>
                      

                      <div className="modal-footer">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          data-bs-dismiss="modal"
                        >
                          Close
                        </button>
                        <button type="submit" className="btn btn-primary">
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}
