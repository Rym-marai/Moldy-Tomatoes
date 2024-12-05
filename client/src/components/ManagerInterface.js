import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config'; // Import the configuration file
import './ManagerInterface.css'; // Import the CSS file


const mockMovies = [
  { _id: '1', title: 'Product aa' },
  { _id: '2', title: 'Product 2' },
  { _id: '3', title: 'Product 3' },
];

const mockReviews = [
  { _id: '1', movieTitle: 'Product aa', rating: 4, userId: { firstName: 'Rym', lastName: 'Marai' } },
  { _id: '2', movieTitle: 'Product aa', rating: 5, userId: { firstName: 'Amir', lastName: 'Marai' } },
  { _id: '3', movieTitle: 'Product 2', rating: 3, userId: { firstName: 'Alice', lastName: 'Johnson' } },
];


const ManagerInterface = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState('');
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Use mock data for movies
    setMovies(mockMovies);
  }, []);

  const fetchReviews = (movieTitle) => {
    // Use mock data for reviews
    const filteredReviews = mockReviews.filter(review => review.movieTitle === movieTitle);
    setReviews(filteredReviews);
  };

  const handleMovieChange = (e) => {
    const movieTitle = e.target.value;
    setSelectedMovie(movieTitle);
    fetchReviews(movieTitle);
  };

  return (
    <div className="manager-interface">
      <h2>Manager Interface</h2>
      <div>
        <label>Product:</label>
        <select className="movie-dropdown" value={selectedMovie} onChange={handleMovieChange} required>
          <option value="">Select a movie</option>
          {movies.map(movie => (
            <option key={movie._id} value={movie.title}>{movie.title}</option>
          ))}
        </select>
      </div>
      <ul>
        {reviews.map(review => (
          <li key={review._id}>
            <p>User: {review.userId ? `${review.userId.firstName} ${review.userId.lastName}` : 'Unknown User'}</p>
            <p>Rating: {review.rating}</p>
          </li>
        ))}
      </ul>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default ManagerInterface;