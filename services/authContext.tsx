import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { SecurityService, UserSession } from './securityService';

interface AuthContextType {
  user: User | null;
  login: (username: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check local storage for persistent login (simulation)
    const storedUser = localStorage.getItem('uecib_user');
    const storedSession = localStorage.getItem('uecib_session_id');

    if (storedUser && storedSession) {
      // Check if session is still valid
      if (SecurityService.isSessionValid(storedSession)) {
        setUser(JSON.parse(storedUser));
      } else {
        // Force logout if revoked
        logout();
      }
    }

    // Periodic check for session revocation
    const interval = setInterval(() => {
      const currentSessionId = localStorage.getItem('uecib_session_id');
      if (currentSessionId && !SecurityService.isSessionValid(currentSessionId)) {
        logout();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const login = (username: string) => {
    const lowerUser = username.toLowerCase();
    let role: 'admin' | 'teacher' = 'teacher';
    let name = 'Usuario del Sistema';

    // Logic to assign names and roles based on username
    if (lowerUser.includes('admin')) {
      role = 'admin';
      name = 'Administrador TIC';
    } else if (lowerUser.includes('rector')) {
      role = 'admin'; // Rector has admin privileges
      name = 'Rectorado';
    } else if (lowerUser.includes('vicerrector')) {
      role = 'admin'; // Vicerrector has admin privileges
      name = 'Vicerrectorado';
    } else if (lowerUser.includes('inspector')) {
      role = 'teacher'; // Inspector acts as a viewer/contributor mostly
      name = 'Inspección General';
    } else {
      role = 'teacher';
      name = `Docente ${username.charAt(0).toUpperCase() + username.slice(1)}`;
    }

    const newUser: User = {
      id: Date.now().toString(),
      username,
      email: `${lowerUser}@uecib.edu.ec`, // Simulated email
      name,
      role,
      status: 'active',
      lastLogin: new Date().toISOString(),
    };

    // Create security session
    const session = SecurityService.registerSession(newUser);

    setUser(newUser);
    localStorage.setItem('uecib_user', JSON.stringify(newUser));
    localStorage.setItem('uecib_session_id', session.sessionId);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('uecib_user');
    localStorage.removeItem('uecib_session_id');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};