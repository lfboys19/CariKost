/**
 * JWT Utility Functions for CariKostan Application
 * Sprint 04 — Secure API
 * 
 * Provides safe JWT decoding, validation, expiry checks, and claim extraction.
 * Complies with OWASP security guidelines (no secret leaks in logs, safe decoding).
 */

// Safe base64url decoder compatible with React Native, Node.js, and Web
export const decodeBase64Url = (base64UrlStr) => {
  if (!base64UrlStr || typeof base64UrlStr !== 'string') return '';

  // Replace base64url chars with standard base64 chars
  let base64 = base64UrlStr.replace(/-/g, '+').replace(/_/g, '/');
  // Pad with '=' so length is a multiple of 4
  while (base64.length % 4) {
    base64 += '=';
  }

  // Cross-platform decoding
  try {
    if (typeof atob === 'function') {
      const binaryString = atob(base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return new TextDecoder().decode(bytes);
    } else if (typeof Buffer !== 'undefined') {
      return Buffer.from(base64, 'base64').toString('utf-8');
    }
  } catch (error) {
    // Fallback simple character decode
    try {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
      let str = '';
      let block = 0;
      let bits = 0;
      for (let i = 0; i < base64.length; i++) {
        const idx = chars.indexOf(base64.charAt(i));
        if (idx === -1) continue;
        block = (block << 6) | idx;
        bits += 6;
        if (bits >= 8) {
          bits -= 8;
          const charCode = (block >> bits) & 0xff;
          str += String.fromCharCode(charCode);
        }
      }
      return decodeURIComponent(escape(str));
    } catch {
      return '';
    }
  }
  return '';
};

// Safe base64url encoder
export const encodeBase64Url = (str) => {
  let base64 = '';
  if (typeof btoa === 'function') {
    base64 = btoa(unescape(encodeURIComponent(str)));
  } else if (typeof Buffer !== 'undefined') {
    base64 = Buffer.from(str, 'utf-8').toString('base64');
  } else {
    // Fallback encoder
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    let block = 0;
    let bits = 0;
    for (let i = 0; i < str.length; i++) {
      block = (block << 8) | str.charCodeAt(i);
      bits += 8;
      while (bits >= 6) {
        bits -= 6;
        base64 += chars.charAt((block >> bits) & 0x3f);
      }
    }
    if (bits > 0) {
      base64 += chars.charAt((block << (6 - bits)) & 0x3f);
      while (base64.length % 4) {
        base64 += '=';
      }
    }
  }
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

/**
 * Parse JWT into header, payload, and signature
 * Returns payload object or null if token is invalid
 */
export const parseJwt = (token) => {
  if (!token || typeof token !== 'string') return null;

  const parts = token.trim().split('.');
  if (parts.length !== 3) {
    return null;
  }

  try {
    const payloadJson = decodeBase64Url(parts[1]);
    if (!payloadJson) return null;
    return JSON.parse(payloadJson);
  } catch {
    return null;
  }
};

/**
 * Check whether a JWT token has expired
 * @param {string} token 
 * @param {number} bufferSeconds - safety margin in seconds before actual expiration
 * @returns {boolean} true if expired or invalid, false if still valid
 */
export const isTokenExpired = (token, bufferSeconds = 30) => {
  if (!token || typeof token !== 'string') return true;

  const payload = parseJwt(token);
  if (!payload) {
    // If not a valid JWT format, treat as invalid/expired
    return true;
  }

  // If token has an exp claim (seconds since epoch)
  if (typeof payload.exp === 'number') {
    const currentTimeInSeconds = Math.floor(Date.now() / 1000);
    return payload.exp <= (currentTimeInSeconds + bufferSeconds);
  }

  // If no exp claim exists, token does not expire automatically
  return false;
};

/**
 * Extract claims from a JWT token
 */
export const getTokenClaims = (token) => {
  const payload = parseJwt(token);
  if (!payload) return null;

  return {
    userId: payload.sub || payload.id || payload.userId,
    email: payload.email,
    role: payload.role,
    name: payload.name,
    exp: payload.exp,
    iat: payload.iat,
  };
};

/**
 * Mask token string for safe logging without leaking credentials
 * E.g. "eyJhbGciOi...[MASKED]"
 */
export const maskToken = (token) => {
  if (!token || typeof token !== 'string') return '[NONE]';
  if (token.length <= 16) return '[MASKED]';
  return `${token.substring(0, 10)}...[MASKED ${token.length} chars]`;
};

/**
 * Create a valid RFC 7519 structure demo JWT for testing & offline evaluation
 * @param {object} user 
 * @param {number} expiresInSeconds 
 * @returns {string} Standard JWT formatted token: header.payload.signature
 */
export const createDemoJwt = (user, expiresInSeconds = 86400) => {
  const now = Math.floor(Date.now() / 1000);
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };

  const payload = {
    sub: user?.id || 'usr_demo_1',
    email: user?.email || 'rifqi.mhs@ui.ac.id',
    name: user?.name || 'Rifqi Pratama',
    role: user?.role || 'Mahasiswa',
    campus: user?.campus || 'Universitas Indonesia',
    iat: now,
    exp: now + expiresInSeconds, // 24 hours validity
    iss: 'carikostan-auth-server',
    aud: 'carikostan-mobile-app',
  };

  const encodedHeader = encodeBase64Url(JSON.stringify(header));
  const encodedPayload = encodeBase64Url(JSON.stringify(payload));
  // Simulated signature for RFC 7519 structure
  const simulatedSignature = encodeBase64Url('sig_carikostan_securesprint04_' + now);

  return `${encodedHeader}.${encodedPayload}.${simulatedSignature}`;
};
