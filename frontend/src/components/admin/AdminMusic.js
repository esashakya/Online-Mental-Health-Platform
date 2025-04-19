import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../../context/AuthContext";
import SearchBar from "../user/SearchBar";
const msg = require("sweetalert2");

export default function AdminMusic() {
  const [music, setMusic] = useState([]);
  const [editId, setEditId] = useState(null);
  const [moods, setMood] = useState([]);
  const [presentPage, setPresentPage] = useState(1);
  const [dataPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");

  const { authTokens, addNewMusic } = useContext(AuthContext);
  const [newData, setNewData] = useState({
    music: "",
    type_music: "",
    mood_id: "",
  });

  // Filter music based on search query
  const filteredMusic = music.filter(
    (m) =>
      m.music.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.type_music.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (moods.find(mood => mood.id === m.mood_id)?.type_mood || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const indexOfLastData = presentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;
  const currentData = filteredMusic.slice(indexOfFirstData, indexOfLastData);

  const paginate = (pageNumber) => setPresentPage(pageNumber);

  const nextPage = () => {
    if (presentPage < Math.ceil(filteredMusic.length / dataPerPage)) {
      setPresentPage(presentPage + 1);
    }
  };

  const prevPage = () => {
    if (presentPage > 1) {
      setPresentPage(presentPage - 1);
    }
  };

  // Fetch data
  useEffect(() => {
    const accessToken = authTokens?.access;
    
    const fetchMusic = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/music/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        setMusic(Array.isArray(data) ? data : []);
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
          }
        });
        const data = await response.json();
        const uniqueMoods = data.reduce((acc, mood) => {
          if (!acc.some((m) => m.type_mood === mood.type_mood)) {
            acc.push(mood);
          }
          return acc;
        }, []);
    
        setMood(uniqueMoods);
      } catch (error) {
        console.error("Error fetching moods:", error);
      }
    };

    fetchMood();
    fetchMusic();
  }, [authTokens]);

  // Handlers
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

  const handleNewMusic = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("music", e.target.music.value);
    formData.append("type_music", e.target.type.value);
    formData.append("mood_id", e.target.mood_id.value);

    addNewMusic(formData);
  };

  const handleEditMusic = async (e, musicId) => {
    e.preventDefault();
    const updatedData = new FormData();
    const currentMusic = music.find((music) => music.id === musicId);

    if (newData.music !== currentMusic?.music) updatedData.append("music", newData.music);
    if (newData.type_music !== currentMusic?.type_music) updatedData.append("type_music", newData.type_music);
    if (newData.mood_id !== currentMusic?.mood_id) updatedData.append("mood_id", newData.mood_id);

    if (updatedData.has("music") || updatedData.has("type_music") || updatedData.has("mood_id")) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/musics/${musicId}`, {
          method: "PUT",
          body: updatedData,
        });

        if (!response.ok) {
          console.error("Update fail:", await response.json());
        } else {
          window.location.reload();
        }
      } catch (error) {
        console.error("Error while editing:", error);
      }
    }
  };

  const handleDeleteBtn = async (pk) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/musics/${pk}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error(`Error while deleting: ${response.status}`);

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
      });

      setTimeout(() => window.location.reload(), 5000);
      setMusic((prev) => prev.filter((music) => music.id !== pk));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="container my-4 p-3 bg-light rounded shadow-sm">
      <SearchBar searchQuery={searchQuery} onSearchChange={(e) => setSearchQuery(e.target.value)} />

      <div className="d-flex justify-content-between align-items-center mt-4">
        <h4 className="text-primary fw-semibold">All Registered Musics</h4>
        <button
        className="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#staticBackdrop"
      >
        <i className="bi bi-plus-circle me-2"></i>
        Add New Music
      </button>
      </div>
      <hr className="border-primary opacity-25" />

      
      <div className="table-responsive mt-4">
        <table className="table table-bordered table-striped table-hover align-middle">
          <thead className="table-primary">
            <tr>
              <th>Music Link</th>
              <th>Type</th>
              <th>Mood</th>
              <th colSpan="2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((m) => (
              <tr key={m.id}>
                <td>{m.music}</td>
                <td>{m.type_music}</td>
                <td>{moods.find((mood) => mood.id === m.mood_id)?.type_mood || "Error"}</td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-success"
                    onClick={() => handleEditBtn(m)}
                    data-bs-toggle="modal"
                    data-bs-target="#editUserModal"
                  >
                     <i className="bi bi-pencil"></i>
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDeleteBtn(m.id)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <nav aria-label="Music table pagination">
          <ul className="pagination float-end mt-3">
            <li className={`page-item ${presentPage === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={prevPage}>
                <i className="bi bi-chevron-left"></i>
              </button>
            </li>
            
            <li className={`page-item ${presentPage === Math.ceil(filteredMusic.length / dataPerPage) ? 'disabled' : ''}`}>
              <button className="page-link" onClick={nextPage}>
                <i className="bi bi-chevron-right"></i>
              </button>
            </li>
          </ul>
        </nav>
      </div>

      <div className="modal fade" id="staticBackdrop" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content" >
            <form onSubmit={handleNewMusic}>
              <div className="modal-header bg-primary" >
                <h5 className="modal-title text-light">Add New Music</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" />
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Music Link</label>
                  <input
                    type="text"
                    className="form-control"
                    name="music"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Music Category</label>
                  <select className="form-control" name="type" required>
                    <option value="">Select Category</option>
                    {["Anxiety", "Panic", "Insomonia"].map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Mood</label>
                  <select className="form-control" name="mood_id" required>
                    <option value="">Select Mood</option>
                    {moods.map((mood) => (
                      <option key={mood.id} value={mood.id}>
                        {mood.type_mood}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                  Close
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Music
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Edit Music Modal */}
      <div className="modal fade" id="editUserModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <form onSubmit={(e) => handleEditMusic(e, editId)}>
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">Edit Music</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label>Music Link</label>
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
                  <label>Music Type</label>
                  <select
                    className="form-control"
                    name="type_music"
                    value={newData.type_music}
                    onChange={handleEdit}
                    required
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
                  <label>Mood</label>
                  <select
                    className="form-control"
                    name="mood_id"
                    value={newData.mood_id}
                    onChange={handleEdit}
                    required
                  >
                    <option value="">Select Mood</option>
                    {moods.map((mood) => (
                      <option key={mood.id} value={mood.id}>
                        {mood.type_mood}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" data-bs-dismiss="modal">
                  Cancel
                </button>
                <button className="btn btn-primary" type="submit">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}