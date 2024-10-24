import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../config'; 
import LogoutButton from './LogoutButton'; 
import './AddReview.css';

const AddReview = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null); 
  const [name, setName] = useState('');
  const [rating, setRating] = useState('');
  const [text, setText] = useState('');
  const [error, setError] = useState('');

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

  useEffect(() => {
    const userName = localStorage.getItem('userName');
    if (userName) {
      setName(userName);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (text.length < 10) {
      setError('Review text must be at least 10 characters long.');
      return;
    }
    try {
      await axios.post(`${config.backendUrl}/movies/${movieId}/reviews`, {
        userId: name, 
        rating: parseInt(rating),
        text,
      });
      navigate(`/movies/${movieId}/reviews`); 
    } catch (error) {
      console.error('Error submitting review:', error);
      setError('Failed to submit review. Please try again.');
    }
  };

  const handleCancel = () => {
    navigate('/movies'); 
  };

  return (
    <div className="add-review">
      <LogoutButton /> {}
      <h2>Add a Review for {movie?.title}</h2> {}
      <form className="add-review-form" onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            readOnly
          />
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
        {error && <p className="error">{error}</p>}
        <div className="button-container">
          <button type="submit">Submit</button>
          <button type="button" onClick={handleCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default AddReview;