import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useMsal } from '@azure/msal-react';
import api from '../utils/api';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(() => {
    // Check localStorage on initialization
    return localStorage.getItem('isLoggingOut') === 'true';
  });
  const { instance, accounts } = useMsal();

  //helper function for making access control easier 
  const isAdmin = useMemo(() => {
    return user?.roles?.includes('Admin') || user?.role === 'admin';
  }, [user]);

  const isInstructor = useMemo(() => {
    return user?.roles?.includes('Instructor') || user?.role === 'instructor';
  }, [user]);

  useEffect(() => {    
    // Don't re-initialize user if we're in the process of logging out
    if (isLoggingOut) {
      
      // Actively clear any accounts that MSAL might have restored
      if (accounts.length > 0) {
        // Clear sessionStorage again to ensure MSAL cache is gone
        sessionStorage.clear();
      }
      
      setUser(null);
      setLoading(false);
      return;
    }
    
    const fetchUserProfile = async () => {
      if (accounts.length > 0) {
        const account = accounts[0];
        
        // Get basic user info from Entra
        const basicUserData = {
          email: account.username,
          fullName: account.name,
        };
        
        try {
          // Check if user has a profile in our system
          const response = await api.get('/api/auth/profile');
          const profile = response.data;
          
          // User exists - merge profile data with MSAL data
          setUser({
            ...basicUserData,
            nurseId: profile.nurseId,
            classId: profile.classId,
            className: profile.className,
            isInstructor: profile.isInstructor,
            isValid: profile.isValid,
            roles: profile.roles || [],
          });
        } catch (error) {
          if (error.response?.status === 404) {
            // User needs to enroll
            setUser({
              ...basicUserData,
              needsEnrollment: true,
            });
          } else {
            console.error('Error fetching profile:', error);
            // Set basic user data anyway
            setUser(basicUserData);
          }
        }
      } else {
        // No accounts, clear user
        setUser(null);
      }
      setLoading(false);
    };
    
    fetchUserProfile();
  }, [accounts, isLoggingOut, instance]);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    localStorage.setItem('isLoggingOut', 'true');
    setIsLoggingOut(true);
    setUser(null);
  };

  // Function to refresh user profile after enrollment
  const refreshProfile = async () => {
    if (accounts.length > 0) {
      const account = accounts[0];
      const basicUserData = {
        email: account.username,
        fullName: account.name,
      };
      
      try {
        const response = await api.get('/api/auth/profile');
        const profile = response.data;
        
        setUser({
          ...basicUserData,
          nurseId: profile.nurseId,
          classId: profile.classId,
          className: profile.className,
          isInstructor: profile.isInstructor,
          isValid: profile.isValid,
          roles: profile.roles || [],
        });
      } catch (error) {
        console.error('Error refreshing profile:', error);
      }
    }
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      isAdmin,
      isInstructor,
      login, 
      logout,
      loading,
      refreshProfile
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

