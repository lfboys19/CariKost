/**
 * Network Information & Connectivity Utility
 * Provides safe online status check across native and web platforms.
 */
import NetInfo from '@react-native-community/netinfo';

/**
 * Checks whether the device currently has active internet connectivity.
 * Falls back safely if NetInfo is unavailable.
 * @returns {Promise<boolean>}
 */
export const checkIsOnline = async () => {
  try {
    const state = await NetInfo.fetch();
    // isConnected is true if network is up; isInternetReachable confirms actual internet traffic
    if (state.isConnected === false) return false;
    if (state.isInternetReachable === false) return false;
    return true;
  } catch (err) {
    // Fallback: check browser navigator if in web / hybrid environment
    if (typeof navigator !== 'undefined' && 'onLine' in navigator) {
      return navigator.onLine;
    }
    return true;
  }
};

/**
 * Subscribes to real-time network state changes.
 * @param {Function} callback (isOnline: boolean, details: object)
 * @returns {Function} unsubscribe function
 */
export const subscribeNetworkStatus = (callback) => {
  try {
    return NetInfo.addEventListener((state) => {
      const isOnline = state.isConnected !== false && state.isInternetReachable !== false;
      callback(isOnline, state);
    });
  } catch (err) {
    return () => {};
  }
};
