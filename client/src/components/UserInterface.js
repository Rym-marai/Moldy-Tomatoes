import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config'; // Import the configuration file
import ReCAPTCHA from 'react-google-recaptcha'; // Import the reCAPTCHA component
import './UserInterface.css'; // Import the CSS file

const UserInterface = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovieForReview, setSelectedMovieForReview] = useState('');
  const [selectedMovieForView, setSelectedMovieForView] = useState('');
  const [rating, setRating] = useState('');
  const [averageRating, setAverageRating] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState('');

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

  const handleAddReview = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!recaptchaToken) {
      setError('Please complete the CAPTCHA.');
      return;
    }
    try {
      const response = await axios.post(`${config.backendUrl}/reviews`, {
        movieTitle: selectedMovieForReview,
        rating: parseInt(rating),
        userId: localStorage.getItem('userId'), // Get the actual user ID from localStorage
        recaptchaToken
      });
      setSelectedMovieForReview('');
      setRating('');
      setSuccess('Review submitted successfully.');
      setRecaptchaToken('');
      fetchAverageRating(selectedMovieForView); // Fetch average rating for the selected movie in the view section
    } catch (error) {
      console.error('Error adding review:', error.response ? error.response.data : error.message);
      setError(error.response ? error.response.data.message : 'Failed to add review.');
    }
  };

  const fetchAverageRating = async (movieTitle) => {
    try {
      const response = await axios.get(`${config.backendUrl}/reviews?movieTitle=${movieTitle}`);
      setAverageRating(response.data.averageRating);
    } catch (error) {
      console.error('Error fetching average rating:', error.response ? error.response.data : error.message);
      setError(error.response ? error.response.data.message : 'Failed to fetch average rating.');
    }
  };

  const handleMovieChangeForView = (e) => {
    const movieTitle = e.target.value;
    setSelectedMovieForView(movieTitle);
    fetchAverageRating(movieTitle);
  };

  const handleRecaptchaChange = (token) => {
    setRecaptchaToken(token);
  };

  return (
    <div className="user-interface">
      <h2>User Interface</h2>
      <div className="interface-sections">
        <div className="add-review-section">
          <h3>Add Review</h3>
          <form onSubmit={handleAddReview}>
            <div>
              <label>Product:</label>
              <select className="add-review-dropdown" value={selectedMovieForReview} onChange={(e) => setSelectedMovieForReview(e.target.value)} required>
                <option value="">Select a product</option>
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
            <ReCAPTCHA
              sitekey="6LfGlI8qAAAAALTLOAs9vwC7cLGyep6LAxiHt724" // Replace with your reCAPTCHA site key
              onChange={handleRecaptchaChange}
            />
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
            <button type="submit">Submit Review</button>
          </form>
        </div>
        <div className="view-reviews-section">
          <h3>View Reviews</h3>
          <div>
            <label>Product:</label>
            <select className="view-reviews-dropdown" value={selectedMovieForView} onChange={handleMovieChangeForView} required>
              <option value="">Select a product</option>
              {movies.map(movie => (
                <option key={movie._id} value={movie.title}>{movie.title}</option>
              ))}
            </select>
          </div>
          <div>
            <h3>Average Rating: {averageRating.toFixed(1)}</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInterface;