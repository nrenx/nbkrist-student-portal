/**
 * Global error handler for third-party scripts
 * 
 * This utility helps suppress and log errors from third-party scripts
 * to prevent them from appearing in the UI.
 */

// Keep track of errors we've already seen to avoid flooding the console
const seenErrors = new Set<string>();

/**
 * Initialize the global error handler
 */
export function initializeErrorHandler() {
  // Store the original error handler
  const originalOnError = window.onerror;
  
  // Set up our custom error handler
  window.onerror = function(message, source, lineno, colno, error) {
    // Create a unique key for this error
    const errorKey = `${message}:${source}:${lineno}:${colno}`;
    
    // Check if this is a third-party script error
    const isThirdPartyScriptError = (
      // Script error with no details is typically a CORS issue with third-party scripts
      message === 'Script error.' || 
      // Check for ad-related domains
      (source && (
        source.includes('highperformanceformat.com') ||
        source.includes('profitableratecpm.com') ||
        source.includes('adsterra') ||
        source.includes('pagead2.googlesyndication.com')
      ))
    );
    
    // If it's a third-party script error, handle it quietly
    if (isThirdPartyScriptError) {
      // Only log it once to avoid console spam
      if (!seenErrors.has(errorKey)) {
        console.warn('Suppressed third-party script error:', { message, source, lineno, colno });
        seenErrors.add(errorKey);
      }
      // Return true to indicate we've handled the error
      return true;
    }
    
    // For other errors, use the original handler if available
    if (originalOnError) {
      return originalOnError(message, source, lineno, colno, error);
    }
    
    // If no original handler, let the error propagate
    return false;
  };
  
  // Also handle unhandled promise rejections
  window.addEventListener('unhandledrejection', function(event) {
    // Check if this is from an ad-related script
    const isAdRelated = event.reason && 
      (String(event.reason).includes('ad') || 
       String(event.reason).includes('Adsterra') ||
       String(event.reason).includes('adsense'));
    
    if (isAdRelated) {
      // Prevent the default handling
      event.preventDefault();
      console.warn('Suppressed unhandled promise rejection from ad script:', event.reason);
    }
  });
  
  console.log('Global error handler initialized');
}

export default initializeErrorHandler;
