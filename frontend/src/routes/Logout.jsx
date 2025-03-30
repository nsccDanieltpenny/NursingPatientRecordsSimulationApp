import React from 'react';
import { useUser } from '../context/UserContext';

const Logout = () => {
  const { logout } = useUser(); 

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>Are you sure you want to log out?</h1>
      <button 
        onClick={logout}
        style={{
          background: 'none',
          border: 'none',
          color: 'grey',
          fontSize: '1rem',
          cursor: 'pointer',
          textDecoration: 'underline',
          marginTop: '1rem'
        }}
      >
        Confirm Logout
      </button>
    </div>
  );
};

export default Logout;