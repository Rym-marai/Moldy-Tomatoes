import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import MainPage from './components/MainPage';
import AuthPage from './components/AuthPage';
import AdminDashboard from './components/AdminDashboard'; // Import the AdminDashboard component
import UserInterface from './components/UserInterface'; // Import the UserInterface component
import ManagerInterface from './components/ManagerInterface'; // Import the ManagerInterface component
import Header from './components/Header';
import AdminAuthPage from './components/AdminAuthPage';

const PrivateRoute = ({ children, roles }) => {
  const userRole = localStorage.getItem('role'); // Get the user role from localStorage

  if (roles && roles.indexOf(userRole) === -1) {
    return <Navigate to="/" />;
  }

  return children;
};

const App = () => {
  const userRole = localStorage.getItem('role'); // Get the user role from localStorage

  console.log('User Role:', userRole);

  return (
    <Router>
      <Header /> {/* Add the Header component */}
      <Routes>
        <Route path="/" element={<MainPage />} /> {/* Set MainPage as the index page */}
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/admin-auth" element={<AdminAuthPage />} /> {/* Admin/Manager login route */}
        <Route path="/user-interface" element={<PrivateRoute roles={['user']}><UserInterface /></PrivateRoute>} /> {/* User interface route */}
        <Route path="/admin" element={<PrivateRoute roles={['admin']}><AdminDashboard /></PrivateRoute>} /> {/* Admin dashboard route */}
        <Route path="/manager-interface" element={<PrivateRoute roles={['manager']}><ManagerInterface /></PrivateRoute>} /> {/* Manager interface route */}
      </Routes>
    </Router>
  );
};

export default App;