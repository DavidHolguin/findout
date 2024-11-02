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
        category: companyData.category?.name,
        timestamp,
      };
      
      visits.unshift(newVisit);
      
      // Keep only the last MAX_HISTORY_ITEMS visits
      const updatedVisits = visits.slice(0, MAX_HISTORY_ITEMS);
      localStorage.setItem(STORAGE_KEYS.COMPANY_VISITS, JSON.stringify(updatedVisits));
      
      // Update user preferences based on categories
      updateUserPreferences('categories', companyData.category?.name);
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

  const trackCategoryClick = (categoryId, categoryName) => {
    try {
      const clicks = JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORY_CLICKS) || '[]');
      const timestamp = new Date().toISOString();
      
      const newClick = {
        categoryId,
        categoryName,
        timestamp
      };
      
      clicks.unshift(newClick);
      const updatedClicks = clicks.slice(0, MAX_HISTORY_ITEMS);
      localStorage.setItem(STORAGE_KEYS.CATEGORY_CLICKS, JSON.stringify(updatedClicks));
      
      // Update user preferences based on categories
      updateUserPreferences('categories', categoryName);
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
        
        preferences.categories[value] = (preferences.categories[value] || 0) + 1;
      }
      
      localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(preferences));
    } catch (error) {
      console.error('Error updating user preferences:', error);
    }
  };

  const getUserPreferences = () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES) || '{}');
    } catch (error) {
      console.error('Error getting user preferences:', error);
      return {};
    }
  };

  return {
    trackCompanyVisit,
    trackSearch,
    trackCategoryClick,
    getUserPreferences
  };
};