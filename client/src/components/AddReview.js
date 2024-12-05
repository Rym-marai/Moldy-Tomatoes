import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config'; // Import the configuration file
import './AddReview.css'; // Import the CSS file

const AddReview = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState('');
  const [rating, setRating] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(`${config.backendUrl}/movies`);
        setMovies(response.data);
      } catch (error) {
        console.error('Error fetching movies:', error.response ? error.response.data : error.message);
        setError(error.response ? error.response.data.message : 'Failed to fetch movies.');
      }
    };

    fetchMovies();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${config.backendUrl}/reviews`, {
        movieTitle: selectedMovie,
        rating: parseInt(rating),
        userId: 'currentUserId' // Replace with the actual user ID
      });
      setSelectedMovie('');
      setRating('');
    } catch (error) {
      console.error('Error adding review:', error.response ? error.response.data : error.message);
      setError(error.response ? error.response.data.message : 'Failed to add review.');
    }
  };

  return (
    <div className="add-review">
      <h2>Add Review</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Movie:</label>
          <select value={selectedMovie} onChange={(e) => setSelectedMovie(e.target.value)} required>
            <option value="">Select a movie</option>
            {movies.map(movie => (
              <option key={movie._id} value={movie.title}>{movie.title}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Rating:</label>
          <input
            type="number"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            min="1"
            max="5"
            required
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit">Submit Review</button>
      </form>
    </div>
  );
};

export default AddReview;