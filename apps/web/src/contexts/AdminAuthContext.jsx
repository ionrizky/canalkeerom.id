import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const session = localStorage.getItem('adminAuth');
    if (session) {
      try {
        const data = JSON.parse(session);
        if (data.isAuthenticated) {
          setIsAuthenticated(true);
          setUsername(data.username || 'admin');
        }
      } catch (e) {
        console.error('Failed to parse admin auth session', e);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (user, pass) => {
    // Ensure inputs are trimmed of whitespace for accurate comparison
    const cleanUser = (user || '').trim();
    const cleanPass = (pass || '').trim();

    // Hardcoded default admin credentials as per requirements
    if (cleanUser === 'admin' && cleanPass === 'admin123') {
      setIsAuthenticated(true);
      setUsername(cleanUser);
      localStorage.setItem('adminAuth', JSON.stringify({ isAuthenticated: true, username: cleanUser }));
      return { success: true };
    }
    
    return { success: false, message: 'Invalid credentials' };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUsername('');
    localStorage.removeItem('adminAuth');
  };

  return (
    <AdminAuthContext.Provider value={{ 
      isAuthenticated, 
      username, 
      adminName: 'Administrator', // Kept for compatibility with AdminDashboardLayout
      login, 
      logout, 
      isLoading 
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  return context;
};