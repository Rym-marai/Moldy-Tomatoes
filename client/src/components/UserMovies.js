import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config'; // Import the configuration file
import './UserMovies.css'; // Import the CSS file

const UserMovies = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState('');
  const [rating, setRating] = useState('');
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(`${config.backendUrl}/movies`);
        setMovies(response.data);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies();
  }, []);

  const handleAddReview = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      await axios.post(`${config.backendUrl}/movies/${selectedMovie}/reviews`, {
        userId,
        rating: parseInt(rating),
        text,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setSelectedMovie('');
      setRating('');
      setText('');
    } catch (error) {
      console.error('Error adding review:', error);
      setError('Failed to add review. Please try again.');
    }
  };

  return (
    <div className="user-movies">
      <h2>Rate Movies</h2>
      <form onSubmit={handleAddReview}>
        <div>
          <label>Movie:</label>
          <select value={selectedMovie} onChange={(e) => setSelectedMovie(e.target.value)} required>
            <option value="">Select a movie</option>
            {movies.map(movie => (
              <option key={movie._id} value={movie._id}>{movie.title}</option>
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
        <div>
          <label>Review:</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit Review</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default UserMovies;