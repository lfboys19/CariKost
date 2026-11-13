/**
 * Secure API Client for CariKostan Application
 * Sprint 04 — Secure API
 * 
 * Features:
 * - HTTPS Protocol Validation
 * - Automatic Authorization: Bearer <token> Header Injection
 * - Safe Token Retrieval from expo-secure-store via SecureStorage
 * - Strict 401 Unauthorized & 403 Forbidden Error Handling
 * - Request Timeout & Network Failure Resilience
 * - OWASP Compliance (Zero token/password leakage in console logs)
 */

import { API_BASE_URL, API_ENDPOINTS, SECURITY_CONFIG } from './apiConfig';
import { SecureStorage, STORAGE_KEYS } from '../utils/storage';
import { isTokenExpired, maskToken } from './jwtUtils';

class ApiClient {
  constructor() {
    this.baseUrl = API_BASE_URL;
    this.onUnauthorizedCallback = null;
  }

  /**
   * Register a callback triggered when an API returns 401 Unauthorized
   * (e.g. to automatically log out and reset user session)
   */
  setOnUnauthorized(callback) {
    this.onUnauthorizedCallback = callback;
  }

  /**
   * Set the base URL dynamically (e.g. if configured by user or env)
   */
  setBaseUrl(newUrl) {
    if (newUrl) {
      this.baseUrl = newUrl.replace(/\/+$/, '');
    }
  }

  /**
   * Validate that URL strictly uses HTTPS in accordance with security checklist
   */
  validateUrlProtocol(url) {
    if (SECURITY_CONFIG.REQUIRE_HTTPS && !url.startsWith('https://')) {
      // In development or local testing, http may be permitted, but we flag a warning
      if (url.includes('localhost') || url.includes('127.0.0.1') || url.includes('10.0.2.2')) {
        // Local loopback exception for local emulator testing
        return true;
      }
      throw new Error(`[Security Policy] HTTPS is strictly required for server communication. Attempted: ${url}`);
    }
    return true;
  }

  /**
   * Core HTTP request handler
   */
  async request(endpoint, options = {}) {
    const {
      method = 'GET',
      body = null,
      token = null,
      requiresAuth = true,
      headers = {},
      timeoutMs = SECURITY_CONFIG.REQUEST_TIMEOUT_MS,
    } = options;

    const fullUrl = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;

    // Verify HTTPS protocol compliance
    try {
      this.validateUrlProtocol(fullUrl);
    } catch (secErr) {
      return {
        ok: false,
        status: 0,
        error: 'INSECURE_PROTOCOL',
        message: secErr.message,
      };
    }

    // Build headers
    const requestHeaders = {
      [SECURITY_CONFIG.HEADER_CONTENT_TYPE]: 'application/json',
      Accept: 'application/json',
      ...headers,
    };

    // Bearer token injection
    let effectiveToken = token;
    if (requiresAuth && !effectiveToken) {
      // Retrieve stored token from SecureStorage
      effectiveToken = await SecureStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    }

    if (requiresAuth) {
      if (!effectiveToken) {
        return {
          ok: false,
          status: 401,
          error: 'NO_TOKEN',
          message: 'Token otentikasi tidak ditemukan. Silakan masuk terlebih dahulu.',
        };
      }

      // Check if JWT token has already expired before sending request
      if (isTokenExpired(effectiveToken)) {
        if (this.onUnauthorizedCallback) {
          this.onUnauthorizedCallback();
        }
        return {
          ok: false,
          status: 401,
          error: 'TOKEN_EXPIRED',
          message: 'Sesi login telah kedaluwarsa. Silakan masuk kembali.',
        };
      }

      // Add Authorization: Bearer <access_token> header
      requestHeaders[SECURITY_CONFIG.HEADER_AUTHORIZATION] = 
        `${SECURITY_CONFIG.TOKEN_PREFIX}${effectiveToken}`;
    }

    // Timeout using AbortController
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const fetchConfig = {
      method,
      headers: requestHeaders,
      signal: controller.signal,
    };

    if (body && ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
      fetchConfig.body = typeof body === 'string' ? body : JSON.stringify(body);
    }

    try {
      const response = await fetch(fullUrl, fetchConfig);
      clearTimeout(timeoutId);

      // Parse JSON response safely
      let data = null;
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        try {
          data = await response.json();
        } catch {
          data = null;
        }
      } else {
        const text = await response.text();
        data = { message: text };
      }

      // Handle 401 Unauthorized
      if (response.status === 401) {
        if (this.onUnauthorizedCallback && requiresAuth) {
          this.onUnauthorizedCallback();
        }
        return {
          ok: false,
          status: 401,
          error: 'UNAUTHORIZED',
          message: data?.message || 'Otentikasi gagal atau token tidak valid.',
          data,
        };
      }

      // Handle 403 Forbidden
      if (response.status === 403) {
        return {
          ok: false,
          status: 403,
          error: 'FORBIDDEN',
          message: data?.message || 'Akses ditolak: Anda tidak memiliki izin untuk sumber daya ini.',
          data,
        };
      }

      // Handle other non-2xx errors
      if (!response.ok) {
        return {
          ok: false,
          status: response.status,
          error: `HTTP_${response.status}`,
          message: data?.message || `Server merespons dengan status ${response.status}`,
          data,
        };
      }

      return {
        ok: true,
        status: response.status,
        data,
      };
    } catch (networkError) {
      clearTimeout(timeoutId);

      const isAborted = networkError.name === 'AbortError';
      const errorMessage = isAborted
        ? `Request timeout (${timeoutMs / 1000}s). Server backend tidak merespons.`
        : 'Gagal terhubung ke server backend (Network Error). Pastikan server aktif dan URL benar.';

      return {
        ok: false,
        status: 0,
        error: isAborted ? 'TIMEOUT' : 'NETWORK_ERROR',
        message: errorMessage,
        originalError: networkError.message,
      };
    }
  }

  // HTTP Helper methods
  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  async post(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'POST', body });
  }

  async put(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'PUT', body });
  }

  async delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }

  /**
   * Diagnostic Test: Authenticated Request
   * Makes a request to protected endpoint WITH the provided or stored Bearer token
   */
  async testAuthenticatedRequest(token = null) {
    const effectiveToken = token || (await SecureStorage.getItem(STORAGE_KEYS.AUTH_TOKEN));
    return this.get(API_ENDPOINTS.AUTH_PROFILE, {
      token: effectiveToken,
      requiresAuth: true,
    });
  }

  /**
   * Diagnostic Test: Unauthenticated Request
   * Makes a request to protected endpoint WITHOUT the Authorization header
   * to verify that protected endpoints strictly reject requests without token
   */
  async testUnauthenticatedRequest() {
    return this.get(API_ENDPOINTS.AUTH_PROFILE, {
      requiresAuth: false, // Do NOT send Bearer token
    });
  }
}

export const apiClient = new ApiClient();
