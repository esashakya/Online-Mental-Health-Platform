import React from 'react'

export default function SearchBar() {
    return (
      <div>
        <div className="container my-4">
        <div className="input-group shadow-sm rounded-pill bg-light">
          <span className="input-group-text bg-transparent border-0">
            <i className="bi bi-search text-primary"></i>
          </span>
          <input
            type="text"
            className="form-control border-0 bg-transparent "
            placeholder="Search ..."
            style={{ fontSize: "1.1rem",outline:"none"
             }}
          />
          <button className="btn btn-primary rounded-pill px-4 " type="button">
            Search
          </button>
        </div>
      </div>
      </div>
    )
  }



