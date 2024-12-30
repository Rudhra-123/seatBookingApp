import React, { useState, useEffect } from 'react';
import { Coach } from './components/Coach';
import LoginForm from './components/LoginForm';
import RegistrationForm from './components/RegistrationForm';
import Cookies from 'js-cookie'; // Import js-cookie for cookie management

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(true);  // State to toggle between login and registration forms

  // Check if the user is logged in (if the token is present in cookies)
  useEffect(() => {
    const token = Cookies.get('token'); // Get token from cookies
    if (token) {
      setIsLoggedIn(true); // Set user as logged in if token is found
    }
  }, []); // Only run once when the component mounts

  const handleLogout = () => {
    // Clear the token from cookies and log the user out
    Cookies.remove('token');
    setIsLoggedIn(false);
  };

  return (
    <div className="App">
      {isLoggedIn ? (
        <>
          <Coach />
          <button onClick={handleLogout} style={logoutButtonStyle}>Logout</button>
        </>
      ) : (
        <div className="form-container">
          {/* Conditional rendering based on state */}
          {showLogin ? (
            <LoginForm setIsLoggedIn={setIsLoggedIn} />
          ) : (
            <RegistrationForm setIsLoggedIn={setIsLoggedIn} />
          )}

          {/* Toggle between Login and Registration forms */}
          <div style={toggleContainerStyle}>
            <button 
              onClick={() => setShowLogin(true)} 
              style={toggleButtonStyle}
            >
              Already have an account? Login
            </button>
            <button 
              onClick={() => setShowLogin(false)} 
              style={toggleButtonStyle}
            >
              Don't have an account? Register
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Inline styles for buttons
const logoutButtonStyle = {
  padding: '12px 20px',
  backgroundColor: '#dc3545',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '16px',
  marginTop: '20px',
  width: '100px',
  alignSelf: 'center'
};

const toggleContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  gap: '15px',
  marginTop: '20px'
};

const toggleButtonStyle = {
  padding: '10px 15px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '14px',
  width: '180px',
  textAlign: 'center',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  transition: 'background-color 0.3s, transform 0.3s',
};

export default App;
