import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// In-memory fallback for web/testing if SecureStore is not natively supported
const memoryStorage = {};

export const SecureStorage = {
  /**
   * Save a key-value pair securely
   */
  async setItem(key, value) {
    try {
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem(key, stringValue);
        } else {
          memoryStorage[key] = stringValue;
        }
        return true;
      }
      await SecureStore.setItemAsync(key, stringValue);
      return true;
    } catch (error) {
      console.warn(`[SecureStorage] Error saving key ${key}:`, error);
      memoryStorage[key] = typeof value === 'string' ? value : JSON.stringify(value);
      return false;
    }
  },

  /**
   * Retrieve a securely saved item
   */
  async getItem(key, isJson = false) {
    try {
      let rawValue = null;
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && window.localStorage) {
          rawValue = window.localStorage.getItem(key);
        } else {
          rawValue = memoryStorage[key] || null;
        }
      } else {
        rawValue = await SecureStore.getItemAsync(key);
      }

      if (!rawValue) return null;
      if (isJson) {
        try {
          return JSON.parse(rawValue);
        } catch {
          return rawValue;
        }
      }
      return rawValue;
    } catch (error) {
      console.warn(`[SecureStorage] Error retrieving key ${key}:`, error);
      const fallback = memoryStorage[key];
      if (fallback && isJson) {
        try {
          return JSON.parse(fallback);
        } catch {
          return fallback;
        }
      }
      return fallback || null;
    }
  },

  /**
   * Remove an item from secure storage
   */
  async removeItem(key) {
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.removeItem(key);
        }
      } else {
        await SecureStore.deleteItemAsync(key);
      }
      delete memoryStorage[key];
      return true;
    } catch (error) {
      console.warn(`[SecureStorage] Error deleting key ${key}:`, error);
      delete memoryStorage[key];
      return false;
    }
  },
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'carikost_auth_token',
  USER_DATA: 'carikost_user_data',
  BOOKMARKS: 'carikost_saved_kosts',
};
