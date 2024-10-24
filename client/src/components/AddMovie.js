import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header'; 
import LogoutButton from './LogoutButton'; 
import './AddMovie.css';

const AddMovie = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [name, setName] = useState('');
  const [rating, setRating] = useState('');
  const [text, setText] = useState('');
  const [error, setError] = useState('');

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
      navigate('/movies');
    } catch (error) {
      console.error('Error submitting movie:', error);
      setError('Failed to submit movie. Please try again.');
    }
  };

  const handleCancel = () => {
    navigate('/movies');
  };

  return (
    <div className="add-movie">
      <Header /> {}
      <LogoutButton /> {}
      <h2>Submit a Movie and a Review </h2>
      <form className="add-movie-form" onSubmit={handleSubmit}>
        <div>
          <label>Movie Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Your Name:</label>
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
          <label>Your Review:</label>
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

export default AddMovie;