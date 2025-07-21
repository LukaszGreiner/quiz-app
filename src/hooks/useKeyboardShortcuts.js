import { useEffect } from "react";

/**
 * Custom hook for keyboard shortcuts
 * @param {Object} shortcuts - Object with key combinations and their handlers
 */
export const useKeyboardShortcuts = (shortcuts) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Get key combination
      const keys = [];
      if (event.ctrlKey) keys.push('ctrl');
      if (event.shiftKey) keys.push('shift');
      if (event.altKey) keys.push('alt');
      if (event.metaKey) keys.push('meta');
      keys.push(event.key.toLowerCase());
      
      const combination = keys.join('+');
      
      // Find matching shortcut
      const handler = shortcuts[combination];
      if (handler) {
        event.preventDefault();
        handler(event);
      }
    };

    // Add event listener
    document.addEventListener('keydown', handleKeyDown);
    
    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts]);
};

/**
 * Hook for common app shortcuts
 */
export const useAppShortcuts = (navigate, setActiveTab) => {
  const shortcuts = {
    // Navigation shortcuts
    'ctrl+h': () => navigate('/'),
    'ctrl+n': () => navigate('/newquiz'),
    'ctrl+s': () => navigate('/statistics'),
    'ctrl+p': () => navigate('/user/details'),
    
    // Profile tab shortcuts
    'ctrl+1': () => setActiveTab && setActiveTab('overview'),
    'ctrl+2': () => setActiveTab && setActiveTab('activity'), 
    'ctrl+3': () => setActiveTab && setActiveTab('stats'),
    'ctrl+4': () => setActiveTab && setActiveTab('achievements'),
    'ctrl+5': () => setActiveTab && setActiveTab('settings'),
    
    // Search shortcut
    'ctrl+k': () => {
      const searchInput = document.querySelector('input[type="search"]');
      if (searchInput) {
        searchInput.focus();
      }
    },
    
    // Help shortcut
    'ctrl+shift+h': () => {
      // Show help modal or navigate to help page
      console.log('Show help');
    }
  };

  useKeyboardShortcuts(shortcuts);
};
