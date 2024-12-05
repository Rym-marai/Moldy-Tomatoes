import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config'; // Import the configuration file
import './AdminDashboard.css'; // Import the CSS file

const AdminDashboard = () => {
  const [movies, setMovies] = useState([]);
  const [users, setUsers] = useState([]);
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(`${config.backendUrl}/admin/movies`);
        setMovies(response.data);
      } catch (error) {
        console.error('Error fetching movies:', error.response ? error.response.data : error.message);
        setError(error.response ? error.response.data.message : 'Failed to fetch movies.');
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${config.backendUrl}/admin/users`);
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error.response ? error.response.data : error.message);
        setError(error.response ? error.response.data.message : 'Failed to fetch users.');
      }
    };

    fetchMovies();
    fetchUsers();
  }, []);

  const handleAddMovie = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${config.backendUrl}/admin/movies`, {
        title,
        averageRating: 0,
        reviews: []
      });
      setMovies([...movies, response.data]);
      setTitle('');
    } catch (error) {
      console.error('Error adding movie:', error.response ? error.response.data : error.message);
      setError(error.response ? error.response.data.message : 'Failed to add movie.');
    }
  };

  const handleDeleteMovie = async (movieId) => {
    try {
      await axios.delete(`${config.backendUrl}/admin/movies/${movieId}`);
      setMovies(movies.filter(movie => movie._id !== movieId));
    } catch (error) {
      console.error('Error deleting movie:', error.response ? error.response.data : error.message);
      setError(error.response ? error.response.data.message : 'Failed to delete movie.');
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <div className="management-sections">
        <div className="movies-management">
          <h3>Movies Management</h3>
          <form onSubmit={handleAddMovie}>
            <div>
              <label>Title:</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            {error && <p className="error">{error}</p>}
            <button type="submit">Add Movie</button>
          </form>
          <ul>
            {movies.map(movie => (
              <li key={movie._id}>
                {movie.title} (Rating: {movie.averageRating})
                <button onClick={() => handleDeleteMovie(movie._id)}>X</button>
              </li>
            ))}
          </ul>
        </div>
        <div className="users-management">
          <h3>User Management</h3>
          <ul>
            {users.map(user => (
              <li key={user._id}>
                <p>Username: {user.firstName} {user.lastName}</p>
                <p>Email: {user.email}</p>
                <p>Password: {user.password}</p>
                <p>Rated Products:</p>
                <ul>
                  {(user.reviews || []).map(review => (
                    <li key={review._id}>
                      Movie: {review.movieTitle}, Rating: {review.rating}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;