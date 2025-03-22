import React, { useState } from 'react';

function LoginComponent() {
  // State for login inputs
  const [email, setEmail] = useState('abcd@gmail.com');
  const [password, setPassword] = useState('Abcd123!');
  
  // State to store the token
  const [token, setToken] = useState(null);
  const [message, setMessage] = useState('');
  
  // Login function
  const handleLogin = async () => {
    try {
      setMessage('Logging in...');
      //change the ip address to your own hosting
      const response = await fetch('http://10.211.55.7:5232/api/Auth/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          email: email,
          password: password
        })
      });
      
      const data = await response.json();
      if (data.token) {
        setToken(data.token);
        setMessage('Login successful!');
        console.log("Token stored:", data.token);
      } else {
        setMessage(`Login failed: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      setMessage(`Login error: ${error.message}`);
      console.error("Login failed:", error);
    }
  };
  
  // Get patient data
  const getPatientData = async () => {
    if (!token) {
      setMessage('Please login first');
      return;
    }
    
    try {
      setMessage('Fetching patient data...');
      
      const response = await fetch('http://10.211.55.7:5232/api/Patients/nurse/patient/0/assessments', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      console.log("Patient data:", data);
      setMessage('Patient data retrieved successfully!');
    } catch (error) {
      setMessage(`Error fetching patient data: ${error.message}`);
      console.error("Error fetching patient data:", error);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>Nursing App Login</h2>
      
      {!token ? (
        <div>
          <div style={{ marginBottom: "10px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>Email:</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              style={{ padding: "8px", width: "250px" }}
            />
          </div>
          
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>Password:</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              style={{ padding: "8px", width: "250px" }}
            />
          </div>
          
          <button 
            onClick={handleLogin}
            style={{ 
              padding: "10px 15px", 
              backgroundColor: "#4CAF50", 
              color: "white", 
              border: "none", 
              borderRadius: "4px", 
              cursor: "pointer" 
            }}
          >
            Login
          </button>
        </div>
      ) : (
        <div>
          <div style={{ marginTop: "10px", marginBottom: "15px", wordBreak: "break-all" }}>
            <strong>Token:</strong> {token.substring(0, 40)}...
          </div>
          <div style={{ marginTop: "10px" }}>
            <button 
              onClick={getPatientData}
              style={{ 
                padding: "10px 15px", 
                backgroundColor: "#2196F3", 
                color: "white", 
                border: "none", 
                borderRadius: "4px", 
                cursor: "pointer" 
              }}
            >
              Get Patient #0 Data
            </button>
            <button 
              onClick={() => {
                setToken(null);
                setMessage('Logged out');
              }}
              style={{ 
                marginLeft: "10px",
                padding: "10px 15px", 
                backgroundColor: "#f44336", 
                color: "white", 
                border: "none", 
                borderRadius: "4px", 
                cursor: "pointer" 
              }}
            >
              Logout
            </button>
          </div>
        </div>
      )}
      
      {message && (
        <div style={{ marginTop: "15px", padding: "10px", backgroundColor: "#f0f0f0", borderRadius: "4px" }}>
          {message}
        </div>
      )}
    </div>
  );
}

export default LoginComponent;
