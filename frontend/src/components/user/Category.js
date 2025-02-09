import React from "react";

export default function Category() {
  return (
    <div>
      <div className="d-flex flex-row mx-2 ">
        <div className="category-item mx-2">
          <div className="category fw-lighter text-center rounded btn btn-outline-primary">
            All
          </div>
        </div>
        <div className="category-item mx-2">
          <div className="category fw-lighter text-center rounded btn btn-outline-primary">
            Anxiety
          </div>
        </div>
        <div className="category-item mx-2">
          <div className="category fw-lighter text-center rounded btn btn-outline-primary">
            Insomonia
          </div>
        </div>
        <div className="category-item mx-2">
          <div className="category fw-lighter text-center rounded btn btn-outline-primary">
            Panic
          </div>
        </div>
        
      </div>
    </div>
  );
}
