/**
 * Auth Service for CariKostan Application
 * Sprint 04 — Secure API
 * 
 * Manages API authentication, session validation, token storage, and protected requests.
 */

import { apiClient } from './apiClient';
import { API_ENDPOINTS } from './apiConfig';
import { SecureStorage, STORAGE_KEYS } from '../utils/storage';
import { parseJwt, isTokenExpired, getTokenClaims, createDemoJwt } from './jwtUtils';

export const authService = {
  /**
   * 1 & 2 & 3. Login through API & obtain Access Token
   */
  async login(email, password) {
    const response = await apiClient.post(
      API_ENDPOINTS.AUTH_LOGIN,
      {
        email: email.trim().toLowerCase(),
        password,
      },
      {
        requiresAuth: false,
      }
    );

    if (response.ok && response.data) {
      // Extract access token (compatible with multiple backend standards: token, accessToken, data.token)
      const accessToken = 
        response.data.accessToken || 
        response.data.token || 
        response.data.data?.token || 
        response.data.data?.accessToken;

      if (!accessToken) {
        return {
          success: false,
          error: 'INVALID_TOKEN_RESPONSE',
          message: 'Server tidak mengembalikan access token yang valid.',
        };
      }

      // Extract user info from response or token claims
      const tokenClaims = getTokenClaims(accessToken);
      const user = response.data.user || response.data.data?.user || {
        id: tokenClaims?.userId || 'usr_' + Date.now(),
        name: tokenClaims?.name || email.split('@')[0],
        email: tokenClaims?.email || email,
        role: tokenClaims?.role || 'Mahasiswa',
        campus: 'Universitas Indonesia',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        joinedAt: new Date().toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }),
      };

      // 10. Secure Token Storage (expo-secure-store)
      await SecureStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, accessToken);
      await SecureStorage.setItem(STORAGE_KEYS.USER_DATA, user);

      return {
        success: true,
        token: accessToken,
        user,
      };
    }

    return {
      success: false,
      error: response.error,
      status: response.status,
      message: response.message,
    };
  },

  /**
   * 12. Logout: Invalidate token on server (if backend available) and clear SecureStore
   */
  async logout(token = null) {
    const currentToken = token || (await SecureStorage.getItem(STORAGE_KEYS.AUTH_TOKEN));

    // Notify backend if token exists
    if (currentToken) {
      try {
        await apiClient.post(
          API_ENDPOINTS.AUTH_LOGOUT,
          {},
          {
            token: currentToken,
            requiresAuth: true,
            timeoutMs: 3000, // Short timeout so logout is never blocked by slow network
          }
        );
      } catch (err) {
        // Continue clearing local storage even if server logout call fails
      }
    }

    // Clear local secure storage
    await SecureStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    await SecureStorage.removeItem(STORAGE_KEYS.USER_DATA);

    return { success: true };
  },

  /**
   * Token refresh endpoint
   */
  async refreshToken(currentToken = null) {
    const token = currentToken || (await SecureStorage.getItem(STORAGE_KEYS.AUTH_TOKEN));
    if (!token) {
      return { success: false, message: 'Tidak ada token untuk di-refresh' };
    }

    const response = await apiClient.post(
      API_ENDPOINTS.AUTH_REFRESH,
      {},
      {
        token,
        requiresAuth: true,
      }
    );

    if (response.ok && response.data) {
      const newToken = response.data.accessToken || response.data.token;
      if (newToken) {
        await SecureStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, newToken);
        return { success: true, token: newToken };
      }
    }

    return { success: false, error: response.error, message: response.message };
  },

  /**
   * 6. Access Protected Profile Endpoint
   */
  async getProfile(token = null) {
    return apiClient.get(API_ENDPOINTS.AUTH_PROFILE, {
      token,
      requiresAuth: true,
    });
  },

  /**
   * 6. Access Protected Saved Kosts Endpoint
   */
  async getSavedKosts(token = null) {
    return apiClient.get(API_ENDPOINTS.PROTECTED_SAVED_KOSTS, {
      token,
      requiresAuth: true,
    });
  },

  /**
   * 7 & 11. Validate Session on App Startup
   * Checks whether stored token exists, has valid structure, and is not expired
   */
  async validateSession() {
    try {
      const storedToken = await SecureStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const storedUser = await SecureStorage.getItem(STORAGE_KEYS.USER_DATA, true);

      if (!storedToken) {
        return { isValid: false, reason: 'NO_TOKEN' };
      }

      // Check JWT expiration
      if (isTokenExpired(storedToken)) {
        // Expired -> clean up storage
        await SecureStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        await SecureStorage.removeItem(STORAGE_KEYS.USER_DATA);
        return { isValid: false, reason: 'TOKEN_EXPIRED' };
      }

      return {
        isValid: true,
        token: storedToken,
        user: storedUser,
        claims: getTokenClaims(storedToken),
      };
    } catch (e) {
      return { isValid: false, reason: 'STORAGE_ERROR', error: e.message };
    }
  },

  /**
   * Demo Login helper providing standard RFC 7519 JWT structure
   */
  async demoLogin() {
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

    // Generate valid RFC 7519 JWT structure with 24-hour expiration
    const demoJwt = createDemoJwt(demoUser, 86400);

    await SecureStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, demoJwt);
    await SecureStorage.setItem(STORAGE_KEYS.USER_DATA, demoUser);

    return {
      success: true,
      token: demoJwt,
      user: demoUser,
    };
  },
};
