import { createContext, useContext, useEffect, useState } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [inShift, setInShift] = useState(false); 

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
    console.log("logging in with credentails",credentials);
    
    //const data = await response.json();
    const data = {
      "NurseFullName":"Fei Wang",
      "Email":"fei@nscc.ca"
    }

    setLoading(true);
    setTimeout(function() {

      setUser(data);
      setLoggedIn(true);
      setLoading(false);
    }, 2000);
    
    //if (response.ok) {
      // setUser(data.user);
      // setLoggedIn(true);
      //localStorage.setItem('user', JSON.stringify(data.user));
    //}
  };

  const logout = () => {
    setUser(null);
    setInShift(false);
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
