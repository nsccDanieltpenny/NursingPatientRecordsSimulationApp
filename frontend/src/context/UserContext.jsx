import { createContext, useContext, useState } from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cookies, setCookie] = useCookies(['nurse']);
  const APIHOST = import.meta.env.VITE_API_URL;

  const login = async (credentials) => {
    setLoading(true);
    
    try {
      const response = await axios.post(`${APIHOST}/api/auth/login`, {
        Email: credentials.Email,
        Password: credentials.Password
      });

      setCookie('nurse', response.data, { path: '/' });
      setUser(response.data);
      return true;
      
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setCookie('nurse', '', { path: '/' });
  };

  return (
    <UserContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}