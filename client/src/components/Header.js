import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <header>
      <h2>Movie Review App</h2>
      <button onClick={handleLogout}>Logout</button>
    </header>
  );
};

export default Header;