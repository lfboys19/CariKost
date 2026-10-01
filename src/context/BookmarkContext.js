import React, { createContext, useState, useEffect, useContext } from 'react';
import { SecureStorage, STORAGE_KEYS } from '../utils/storage';

export const BookmarkContext = createContext({
  bookmarks: [],
  isBookmarked: () => false,
  toggleBookmark: async () => {},
  clearBookmarks: async () => {},
});

export const BookmarkProvider = ({ children }) => {
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    const loadBookmarks = async () => {
      try {
        const stored = await SecureStorage.getItem(STORAGE_KEYS.BOOKMARKS, true);
        if (Array.isArray(stored)) {
          setBookmarks(stored);
        }
      } catch (e) {
        console.warn('Failed to load bookmarks:', e);
      }
    };
    loadBookmarks();
  }, []);

  const toggleBookmark = async (kost) => {
    try {
      let updated;
      const exists = bookmarks.some((item) => item.id === kost.id);
      if (exists) {
        updated = bookmarks.filter((item) => item.id !== kost.id);
      } else {
        updated = [kost, ...bookmarks];
      }
      setBookmarks(updated);
      await SecureStorage.setItem(STORAGE_KEYS.BOOKMARKS, updated);
      return !exists;
    } catch (e) {
      console.error('Error toggling bookmark:', e);
      return false;
    }
  };

  const isBookmarked = (id) => {
    return bookmarks.some((item) => item.id === id);
  };

  const clearBookmarks = async () => {
    setBookmarks([]);
    await SecureStorage.removeItem(STORAGE_KEYS.BOOKMARKS);
  };

  return (
    <BookmarkContext.Provider
      value={{
        bookmarks,
        isBookmarked,
        toggleBookmark,
        clearBookmarks,
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
};

export const useBookmark = () => useContext(BookmarkContext);
