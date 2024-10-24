import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../config'; 
import Header from './Header'; 
import LogoutButton from './LogoutButton'; 
import './MovieList.css'; 

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

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

  const handleReadReviews = (movieId) => {
    navigate(`/movies/${movieId}/reviews`);
  };

  const handleWriteReview = (movieId) => {
    navigate(`/movies/${movieId}/review`);
  };

  const handleAddNewMovie = () => {
    navigate('/movies/new');
  };

  return (
    <div className="movie-list">
      <Header /> {}
      <LogoutButton /> {}
      <h2>Movie List</h2>
      <div className="add-movie-button-container">
        <button onClick={handleAddNewMovie}>Add a New Movie</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Movie Title</th>
            <th>Avg. Rating</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {movies.map(movie => (
            <tr key={movie._id}>
              <td>{movie.title}</td>
              <td>{movie.averageRating.toFixed(1)}</td>
              <td>
                <button onClick={() => handleReadReviews(movie._id)}>Read Reviews</button>
                <button onClick={() => handleWriteReview(movie._id)}>Write a Review</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MovieList;