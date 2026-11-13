import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { SecureStorage, STORAGE_KEYS } from '../utils/storage';
import { authService } from '../services/authService';
import { apiClient } from '../services/apiClient';
import { API_BASE_URL } from '../services/apiConfig';
import { createDemoJwt } from '../services/jwtUtils';

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
  testAuthenticatedRequest: async () => {},
  testUnauthenticatedRequest: async () => {},
  apiBaseUrl: API_BASE_URL,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Auto-logout when API returns 401 Unauthorized
  const handleUnauthorized = useCallback(async () => {
    await SecureStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    await SecureStorage.removeItem(STORAGE_KEYS.USER_DATA);
    setToken(null);
    setUser(null);
  }, []);

  // 11. Session Management: Restore and validate session on startup
  useEffect(() => {
    // Register 401 interceptor callback
    apiClient.setOnUnauthorized(handleUnauthorized);

    const bootstrapAsync = async () => {
      try {
        const session = await authService.validateSession();
        if (session.isValid && session.token && session.user) {
          setToken(session.token);
          setUser(session.user);
        } else {
          // If expired or invalid, clear state
          setToken(null);
          setUser(null);
        }
      } catch (e) {
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, [handleUnauthorized]);

  /**
   * 1 & 2. Login via API with Token-based Authentication
   */
  const login = async (email, password) => {
    const result = await authService.login(email, password);
    if (result.success) {
      setToken(result.token);
      setUser(result.user);
      return { success: true };
    }
    return {
      success: false,
      error: result.error,
      status: result.status,
      message: result.message,
    };
  };

  /**
   * Register with Token generation
   */
  const register = async ({ name, email, phone, role, campus }) => {
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

    const newJwt = createDemoJwt(newUser, 86400);

    await SecureStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, newJwt);
    await SecureStorage.setItem(STORAGE_KEYS.USER_DATA, newUser);

    setToken(newJwt);
    setUser(newUser);
    return { success: true };
  };

  /**
   * Demo Login with standard RFC 7519 JWT
   */
  const demoLogin = async () => {
    const result = await authService.demoLogin();
    if (result.success) {
      setToken(result.token);
      setUser(result.user);
      return { success: true };
    }
    return { success: false, message: 'Gagal masuk akun demo.' };
  };

  /**
   * 12. Sempurnakan Logout: Invalidate token & clear SecureStore
   */
  const logout = async () => {
    await authService.logout(token);
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (updates) => {
    const updated = { ...user, ...updates };
    await SecureStorage.setItem(STORAGE_KEYS.USER_DATA, updated);
    setUser(updated);
  };

  /**
   * 13. Test Authenticated Request (with Bearer Token)
   */
  const testAuthenticatedRequest = async () => {
    return apiClient.testAuthenticatedRequest(token);
  };

  /**
   * 14. Test Unauthenticated Request (without Bearer Token)
   */
  const testUnauthenticatedRequest = async () => {
    return apiClient.testUnauthenticatedRequest();
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
        testAuthenticatedRequest,
        testUnauthenticatedRequest,
        apiBaseUrl: API_BASE_URL,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
