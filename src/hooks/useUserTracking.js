import { useEffect } from 'react';

const STORAGE_KEYS = {
  COMPANY_VISITS: 'user_company_visits',
  SEARCH_HISTORY: 'user_search_history',
  CATEGORY_CLICKS: 'user_category_clicks',
  USER_PREFERENCES: 'user_preferences'
};

const MAX_HISTORY_ITEMS = 50;

export const useUserTracking = () => {
  const trackCompanyVisit = (companyData) => {
    try {
      const visits = JSON.parse(localStorage.getItem(STORAGE_KEYS.COMPANY_VISITS) || '[]');
      const timestamp = new Date().toISOString();
      
      const newVisit = {
        companyId: companyData.id,
        companyName: companyData.name,
        category: {
          id: companyData.category?.id,
          name: companyData.category?.name,
          image: companyData.category?.image // Añadido el campo image
        },
        timestamp,
      };
      
      visits.unshift(newVisit);
      
      // Keep only the last MAX_HISTORY_ITEMS visits
      const updatedVisits = visits.slice(0, MAX_HISTORY_ITEMS);
      localStorage.setItem(STORAGE_KEYS.COMPANY_VISITS, JSON.stringify(updatedVisits));
      
      // Update user preferences based on categories
      if (companyData.category?.id && companyData.category?.name) {
        updateUserPreferences('categories', {
          id: companyData.category.id,
          name: companyData.category.name,
          image: companyData.category.image // Añadido el campo image
        });
      }
    } catch (error) {
      console.error('Error tracking company visit:', error);
    }
  };

  const trackSearch = (searchTerm) => {
    try {
      const searches = JSON.parse(localStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY) || '[]');
      const timestamp = new Date().toISOString();
      
      const newSearch = {
        term: searchTerm,
        timestamp
      };
      
      // Don't add duplicate consecutive searches
      if (searches[0]?.term !== searchTerm) {
        searches.unshift(newSearch);
        const updatedSearches = searches.slice(0, MAX_HISTORY_ITEMS);
        localStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(updatedSearches));
      }
    } catch (error) {
      console.error('Error tracking search:', error);
    }
  };

  const trackCategoryClick = (categoryId, categoryName, categoryImage) => { // Añadido el parámetro categoryImage
    try {
      const clicks = JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORY_CLICKS) || '[]');
      const timestamp = new Date().toISOString();
      
      const newClick = {
        categoryId,
        categoryName,
        categoryImage, // Añadido el campo image
        timestamp
      };
      
      clicks.unshift(newClick);
      const updatedClicks = clicks.slice(0, MAX_HISTORY_ITEMS);
      localStorage.setItem(STORAGE_KEYS.CATEGORY_CLICKS, JSON.stringify(updatedClicks));
      
      // Update user preferences based on categories
      updateUserPreferences('categories', {
        id: categoryId,
        name: categoryName,
        image: categoryImage // Añadido el campo image
      });
    } catch (error) {
      console.error('Error tracking category click:', error);
    }
  };

  const updateUserPreferences = (type, value) => {
    try {
      const preferences = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES) || '{}');
      
      if (type === 'categories') {
        if (!preferences.categories) {
          preferences.categories = {};
        }
        
        const categoryKey = `${value.id}-${value.name}`;
        preferences.categories[categoryKey] = {
          id: value.id,
          name: value.name,
          image: value.image, // Añadido el campo image
          count: ((preferences.categories[categoryKey]?.count || 0) + 1)
        };
      }
      
      localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(preferences));
    } catch (error) {
      console.error('Error updating user preferences:', error);
    }
  };

  const getUserPreferences = () => {
    try {
      const preferences = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES) || '{}');
      return {
        ...preferences,
        categories: preferences.categories ? Object.values(preferences.categories) : []
      };
    } catch (error) {
      console.error('Error getting user preferences:', error);
      return {
        categories: []
      };
    }
  };

  const getCompanyVisits = () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.COMPANY_VISITS) || '[]');
    } catch (error) {
      console.error('Error getting company visits:', error);
      return [];
    }
  };

  const getSearchHistory = () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY) || '[]');
    } catch (error) {
      console.error('Error getting search history:', error);
      return [];
    }
  };

  const getCategoryClicks = () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORY_CLICKS) || '[]');
    } catch (error) {
      console.error('Error getting category clicks:', error);
      return [];
    }
  };

  const clearAllUserData = () => {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Error clearing user data:', error);
    }
  };

  return {
    trackCompanyVisit,
    trackSearch,
    trackCategoryClick,
    getUserPreferences,
    getCompanyVisits,
    getSearchHistory,
    getCategoryClicks,
    clearAllUserData
  };
};