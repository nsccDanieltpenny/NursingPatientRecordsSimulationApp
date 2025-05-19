import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(['nurse']);
  const APIHOST = import.meta.env.VITE_API_URL;

  //helper function for making access control easier 
  const isAdmin = useMemo(() => {
    return user?.roles?.includes('Admin') || user?.role === 'admin';
  }, [user]);

  //check for existing session on init load
  useEffect(() => {
    const checkAuth = async () => {
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

      // Set the cookie to expire in 3 hours
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 3); // 3 hours from now

      setCookie('nurse', response.data, {
        path: '/',
        expires: expiryDate, // Set the expiration date
      });
      
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
      isAdmin,
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

