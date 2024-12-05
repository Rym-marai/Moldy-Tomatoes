import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MainPage.css'; // Import the CSS file

const MainPage = () => {
  const navigate = useNavigate();

  const handleUserClick = () => {
    navigate('/auth');
  };

  const handleAdminClick = () => {
    navigate('/admin-auth');
  };

  return (
    <div className="main-page">
      <h2>Welcome to Movie Review App</h2>
      <div className="button-container">
        <button onClick={handleUserClick}>User</button>
        <button onClick={handleAdminClick}>Admin/Manager</button>
      </div>
    </div>
  );
};

export default MainPage;