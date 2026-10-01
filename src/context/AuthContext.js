import React, { createContext, useState, useEffect, useContext } from 'react';
import { SecureStorage, STORAGE_KEYS } from '../utils/storage';

export const AuthContext = createContext({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  demoLogin: async () => {},
  updateProfile: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check stored auth token on startup
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const storedToken = await SecureStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        const storedUser = await SecureStorage.getItem(STORAGE_KEYS.USER_DATA, true);

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(storedUser);
        }
      } catch (e) {
        console.error('Failed to restore auth session:', e);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  const login = async (email, password) => {
    // Simulated authentication with token generation
    const mockToken = 'ck_jwt_' + Math.random().toString(36).substring(2) + Date.now();
    
    // Check if email matches existing demo user or create session user
    const loggedUser = {
      id: 'usr_' + Date.now(),
      name: email.split('@')[0].replace('.', ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase()),
      email: email.trim().toLowerCase(),
      phone: '081234567890',
      role: 'Mahasiswa',
      campus: 'Universitas Indonesia',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      joinedAt: new Date().toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }),
    };

    await SecureStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, mockToken);
    await SecureStorage.setItem(STORAGE_KEYS.USER_DATA, loggedUser);

    setToken(mockToken);
    setUser(loggedUser);
    return { success: true };
  };

  const register = async ({ name, email, phone, role, campus }) => {
    const mockToken = 'ck_jwt_' + Math.random().toString(36).substring(2) + Date.now();
    const newUser = {
      id: 'usr_' + Date.now(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      role: role || 'Mahasiswa',
      campus: campus || 'Universitas Indonesia',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      joinedAt: new Date().toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }),
    };

    await SecureStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, mockToken);
    await SecureStorage.setItem(STORAGE_KEYS.USER_DATA, newUser);

    setToken(mockToken);
    setUser(newUser);
    return { success: true };
  };

  const demoLogin = async () => {
    const demoToken = 'ck_jwt_demo_token_123456';
    const demoUser = {
      id: 'usr_demo',
      name: 'Rifqi Pratama',
      email: 'rifqi.mhs@ui.ac.id',
      phone: '081289998877',
      role: 'Mahasiswa',
      campus: 'Universitas Indonesia (Fasilkom)',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      joinedAt: 'Jan 2025',
    };

    await SecureStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, demoToken);
    await SecureStorage.setItem(STORAGE_KEYS.USER_DATA, demoUser);

    setToken(demoToken);
    setUser(demoUser);
    return { success: true };
  };

  const logout = async () => {
    await SecureStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    await SecureStorage.removeItem(STORAGE_KEYS.USER_DATA);
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (updates) => {
    const updated = { ...user, ...updates };
    await SecureStorage.setItem(STORAGE_KEYS.USER_DATA, updated);
    setUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        register,
        logout,
        demoLogin,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
