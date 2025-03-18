import { createContext, useContext, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';


const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [inShift, setInShift] = useState(false);
  const [cookies, setCookie] = useCookies(['nurse']);

  useEffect(() => {
    // const storedUser = localStorage.getItem('user');
    // const storedShift = localStorage.getItem('inShift');

    // if (storedUser) setUser(JSON.parse(storedUser));
    // if (storedShift) setInShift(JSON.parse(storedShift));

    setLoading(false);
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

      const response = await axios.post('http://localhost:5232/api/nurses/login', credentials);
      console.log('Response:', response.data);
      const data = response.data;

      setTimeout(() => {
        setCookie('nurse', data, { path: '/' });
        setUser(data);
        setLoggedIn(true);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Invalid email or password.');
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
    setInShift(false);
    setCookie('nurse', null);
    const response = await axios.post('http://localhost:5232/api/nurses/logout');
    //localStorage.removeItem('user');
    //localStorage.removeItem('inShift');
  };

  const startShift = () => {
    setInShift(true);
    //localStorage.setItem('inShift', JSON.stringify(true));
  };

  const endShift = () => {
    setInShift(false);
    //localStorage.setItem('inShift', JSON.stringify(false));
  };

  return (
    <UserContext.Provider value={{ user, login, logout, loading, inShift, startShift, endShift }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
