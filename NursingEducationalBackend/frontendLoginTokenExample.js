import React, { useState } from 'react';

function Login() {
  const [email, setEmail] = useState('abcd@gmail.com');
  const [password, setPassword] = useState('Abcd123!');
  const [token, setToken] = useState(null);

  const login = async () => {
    const response = await fetch('http://10.211.55.7:5232/api/Auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    if (data.token) {
      setToken(data.token);
      alert('Login successful!');
    }
  };

  const getPatient = async () => {
    if (!token) return;
    
    const response = await fetch('http://10.211.55.7:5232/api/Patients/nurse/patient/0/assessments', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const data = await response.json();
    console.log(data);
    alert('Data retrieved! Check console.');
  };

  return (
    <div>
      {!token ? (
        <div>
          <input 
            type="email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            placeholder="Email"
          />
          <input 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            placeholder="Password"
          />
          <button onClick={login}>Login</button>
        </div>
      ) : (
        <div>
          <p>Logged in! Token: {token.substring(0, 20)}...</p>
          <button onClick={getPatient}>Get Patient #0</button>
          <button onClick={() => setToken(null)}>Logout</button>
        </div>
      )}
    </div>
  );
}

export default Login;