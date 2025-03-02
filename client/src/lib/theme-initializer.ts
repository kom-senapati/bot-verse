// This script ensures the theme is applied immediately on page load
// before React hydration completes

export function initializeTheme() {
  // Get theme from localStorage or use 'Dark' as default
  const storedTheme = localStorage.getItem('theme') || 'Dark';
  
  // Apply theme to document element
  document.documentElement.setAttribute('data-theme', storedTheme);
  
  // Also store it in localStorage for persistence
  localStorage.setItem('theme', storedTheme);
  
  // Listen for theme changes in localStorage (for cross-tab synchronization)
  window.addEventListener('storage', (e) => {
    if (e.key === 'theme' && e.newValue) {
      document.documentElement.setAttribute('data-theme', e.newValue);
    }
  });
}
