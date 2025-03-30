import { createContext, useContext, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';


const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [shift, setShift] = useState(false);
  const [cookies, setCookie] = useCookies(['nurse']);

  useEffect(() => {
    setLoading(true);
    console.log("loading from local storage");
    const storedUser = localStorage.getItem('User');
    const storedShift = localStorage.getItem('SelectedShift');
    setUser(JSON.parse(storedUser));
    setShift(JSON.parse(storedShift));
    setLoading(false);
    
    console.log("load from local storage",storedUser,storedShift);
  }, []);

  const login = async (credentials) => {
    // const response = await fetch('/api/login', {
    //   method: 'POST',
    //   body: JSON.stringify(credentials),
    //   headers: { 'Content-Type': 'application/json' },
    // });
    console.log("logging in with credentails", credentials);

    setLoading(true);

    try {

      const response = await axios.post('http://localhost:5232/api/Auth/login', credentials);
      console.log('Response:', response.data);
      const data = response.data;

      setTimeout(() => {
        setCookie('nurse', data, { path: '/' });
        console.log("logged in", data);
        
        setUser(data);
        localStorage.setItem('User', JSON.stringify(data));
        setLoggedIn(true);
        setLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Invalid email or password.');
      setLoading(false);
    }
    // setTimeout(function() {

    //   setUser(data);
    //   setLoggedIn(true);
    //   setLoading(false);
    // }, 1000);

    //if (response.ok) {
    // setUser(data.user);
    // setLoggedIn(true);
    //localStorage.setItem('user', JSON.stringify(data.user));
    //}
  };

  const logout = async () => {
    setUser(null);
    setShift(false);
    setCookie('nurse', null);
    const response = await axios.post('http://localhost:5232/api/nurses/logout');
    //localStorage.removeItem('user');
    //localStorage.removeItem('shift');
    localStorage.setItem('User', null);
    localStorage.setItem('SelectedShift', null);
  };

  const startShift = (shift) => {
    setShift(shift);
    localStorage.setItem('SelectedShift', JSON.stringify(shift));
  };

  const endShift = () => {
    setShift(null);
    localStorage.setItem('SelectedShift', null);
  };

  return (
    <UserContext.Provider value={{ user, setUser,login, logout, loading, shift, startShift, endShift }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
