import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  // This is the key change. When the component first loads,
  // it runs this function once to set the initial state.
  const [user, setUser] = useState(() => {
    // 1. Check localStorage for saved user info.
    const userInfo = localStorage.getItem('userInfo');
    // 2. If it exists, parse it from a string back into an object.
    //    If not, the initial state is null (logged out).
    return userInfo ? JSON.parse(userInfo) : null;
  });

  const login = (userData) => {
    // 1. Save the user's info to localStorage. We use JSON.stringify
    //    to convert the user object into a string for storage.
    localStorage.setItem('userInfo', JSON.stringify(userData));
    // 2. Update the application's state to log the user in.
    setUser(userData);
  };

  const logout = () => {
    // 1. Remove the user's info from localStorage.
    localStorage.removeItem('userInfo');
    // 2. Update the application's state to log the user out.
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};