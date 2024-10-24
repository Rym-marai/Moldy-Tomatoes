import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../config'; 
import LogoutButton from './LogoutButton'; 
import './MovieReviews.css';

const MovieReviews = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const loggedUserId = localStorage.getItem('userId'); 

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(`${config.backendUrl}/movies/${movieId}`);
        setMovie(response.data);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  const handleDeleteReview = async (reviewId) => {
    try {
      await axios.delete(`${config.backendUrl}/movies/${movieId}/reviews/${reviewId}`);
      setMovie(prevMovie => ({
        ...prevMovie,
        reviews: prevMovie.reviews.filter(r => r._id !== reviewId),
        averageRating: prevMovie.reviews.length
          ? prevMovie.reviews.reduce((sum, review) => sum + review.rating, 0) / prevMovie.reviews.length
          : 0,
      }));
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const handleDeleteMovie = async () => {
    try {
      await axios.delete(`${config.backendUrl}/movies/${movieId}`);
      navigate('/movies');
    } catch (error) {
      console.error('Error deleting movie:', error);
    }
  };

  const handleBackToMovieList = () => {
    navigate('/movies'); 
  };

  return (
    <div className="movie-reviews">
      <LogoutButton /> {}
      <h2>Reviews for {movie?.title}</h2>
      <table>
        <thead>
          <tr>
            <th>Reviewer</th>
            <th>Rating</th>
            <th>Review</th>
          </tr>
        </thead>
        <tbody>
          {movie?.reviews.map(review => (
            <tr key={review._id}>
              <td>
                {review.userId}
                {review.userId === loggedUserId && (
                  <span className="delete-icon" onClick={() => handleDeleteReview(review._id)}>🗑️</span>
                )}
              </td>
              <td>{review.rating}</td>
              <td>{review.text}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="button-container">
        <button className="delete-movie-button" onClick={handleDeleteMovie}>Delete Movie</button>
        <button className="back-to-movie-list-button" onClick={handleBackToMovieList}>Back to Movie List</button>
      </div>
    </div>
  );
};

export default MovieReviews;