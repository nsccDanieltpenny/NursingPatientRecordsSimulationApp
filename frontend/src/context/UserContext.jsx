import { createContext, useContext, useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(['nurse']);
  const APIHOST = import.meta.env.VITE_API_URL;

  //check for existing session on init load
  useEffect(() => {
    const checkAuth = async => {
      try {
        if (cookies.nurse) {
          setUser(cookies.nurse);
        }
      } catch (error) {
        console.error('Verification error:', error);
        removeCookie('nurse');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (credentials) => {
    setLoading(true);    
    try {
      const response = await axios.post(
        `${APIHOST}/api/auth/login`, {
        Email: credentials.Email,
        Password: credentials.Password
      }
    );

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
    removeCookie('nurse', { path: '/' });
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      login, 
      logout, 
      loading,
      isAuthenticated: !!user // a flag to authenticate user
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}