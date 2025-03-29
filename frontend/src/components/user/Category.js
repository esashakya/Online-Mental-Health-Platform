import React from "react";

export default function Category({ selectedCategory, onCategoryChange }) {
  const categories = ["All", "Anxiety", "Insomonia", "Panic"]; 

  return (
    <div>
      <div className="d-flex flex-row mx-2 ">
        {categories.map((category, index) => (
          <div key={index} className="category-item mx-2">
            <div
              className={`category fw-lighter text-center rounded btn btn-outline-primary ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => onCategoryChange(category)}
            >
              {category}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
