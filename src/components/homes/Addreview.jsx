"use client";

import React, { useState } from 'react';

const AddReviewForm = ({ onAddReview }) => {
  const [name, setName] = useState('');
  const [review, setReview] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !review) {
      alert('Please enter both name and review');
      return;
    }
    // Assuming onAddReview is a function passed from parent component to handle adding reviews
    onAddReview({ name, review });
    setName('');
    setReview('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="review">Review:</label>
        <textarea
          id="review"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          required
        />
      </div>
      <button type="submit">Submit Review</button>
    </form>
  );
};

export default AddReviewForm;
