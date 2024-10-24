import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import MovieList from './components/MovieList';
import MovieReviews from './components/MovieReviews';
import AddReview from './components/AddReview';
import AddMovie from './components/AddMovie';
import AuthPage from './components/AuthPage'; 
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/auth" />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/movies"
          element={
            <PrivateRoute>
              <MovieList />
            </PrivateRoute>
          }
        />
        <Route
          path="/movies/:movieId/reviews"
          element={
            <PrivateRoute>
              <MovieReviews />
            </PrivateRoute>
          }
        />
        <Route
          path="/movies/:movieId/review"
          element={
            <PrivateRoute>
              <AddReview />
            </PrivateRoute>
          }
        />
        <Route
          path="/movies/new"
          element={
            <PrivateRoute>
              <AddMovie />
            </PrivateRoute>
          }
        />
        {}
      </Routes>
    </Router>
  );
};

export default App;