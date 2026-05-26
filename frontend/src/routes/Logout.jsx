import { useEffect, useRef } from 'react';
import { useMsal } from '@azure/msal-react';
import { useUser } from '../context/UserContext';

export default function Logout() {
  const { instance } = useMsal();
  const { logout } = useUser();
  const hasLoggedOut = useRef(false);

  useEffect(() => {
    const handleLogout = () => {
      if (hasLoggedOut.current) {
        return;
      }
      hasLoggedOut.current = true;
      
      // Set logging out flag immediately (persists in localStorage)
      logout();
      
      const accounts = instance.getAllAccounts();
      
      // Clear all MSAL accounts from cache
      accounts.forEach(account => {
        instance.setActiveAccount(null);
      });
      
      // Clear all session storage (this removes MSAL cache too since we use sessionStorage)
      sessionStorage.clear();

      // Force a hard navigation to login to ensure clean state
      window.location.replace('/login');
    };
    
    handleLogout();
  }, [instance, logout]);

  return null; // note: this will be a message eventually 
}