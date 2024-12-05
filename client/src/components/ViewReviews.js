import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config'; // Import the configuration file
import './ViewReviews.css'; // Import the CSS file

const ViewReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState('');
  const userId = 'currentUserId'; // Replace with the actual user ID

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`${config.backendUrl}/reviews`);
        setReviews(response.data);
      } catch (error) {
        console.error('Error fetching reviews:', error.response ? error.response.data : error.message);
        setError(error.response ? error.response.data.message : 'Failed to fetch reviews.');
      }
    };

    fetchReviews();
  }, []);

  const handleDeleteReview = async (reviewId) => {
    try {
      await axios.delete(`${config.backendUrl}/reviews/${reviewId}`);
      setReviews(reviews.filter(review => review._id !== reviewId));
    } catch (error) {
      console.error('Error deleting review:', error.response ? error.response.data : error.message);
      setError(error.response ? error.response.data.message : 'Failed to delete review.');
    }
  };

  return (
    <div className="view-reviews">
      <h2>View Reviews</h2>
      {error && <p className="error">{error}</p>}
      <ul>
        {reviews.map(review => (
          <li key={review._id}>
            <p>Movie: {review.movieTitle}</p>
            <p>Rating: {review.userId === userId ? review.rating : '*****'}</p>
            {review.userId === userId && (
              <button onClick={() => handleDeleteReview(review._id)}>Delete</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ViewReviews;