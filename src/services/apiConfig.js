/**
 * API Configuration for CariKostan Application
 * Sprint 04 — Secure API
 * 
 * Enforces HTTPS for production and defines protected vs public endpoints.
 */

// Base URL configured with HTTPS protocol
// Can be customized via environment variable or updated when backend server is deployed
export const API_BASE_URL = 
  (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_API_URL) 
    ? process.env.EXPO_PUBLIC_API_URL 
    : 'https://api.carikostan.com/api/v1';

export const API_ENDPOINTS = {
  // Auth Endpoints (Protected & Public)
  AUTH_LOGIN: '/auth/login',
  AUTH_REGISTER: '/auth/register',
  AUTH_LOGOUT: '/auth/logout',
  AUTH_REFRESH: '/auth/refresh',
  AUTH_PROFILE: '/auth/profile',

  // Protected App Endpoints (minimal 1 menu terproteksi)
  PROTECTED_SAVED_KOSTS: '/user/saved-kosts',
  PROTECTED_REVIEWS: '/user/my-reviews',

  // Public Endpoints (Accessible without login)
  PUBLIC_KOST_SEARCH: '/kosts/search',
  PUBLIC_KOST_LIST: '/kosts',
  PUBLIC_KOST_DETAIL: (id) => `/kosts/${id}`,
};

export const SECURITY_CONFIG = {
  // Protocol Enforcement
  REQUIRE_HTTPS: true,
  // Header Keys
  HEADER_AUTHORIZATION: 'Authorization',
  HEADER_CONTENT_TYPE: 'Content-Type',
  // Bearer Token Scheme
  TOKEN_PREFIX: 'Bearer ',
  // Default timeout in milliseconds
  REQUEST_TIMEOUT_MS: 10000,
  // Token expiration buffer (seconds before actual exp to consider refreshed)
  EXPIRATION_BUFFER_SECONDS: 30,
};
