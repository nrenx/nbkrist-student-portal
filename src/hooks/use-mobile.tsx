
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false);

  React.useEffect(() => {
    // Set the initial value
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    
    // Create the media query list
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    
    // Create the handler function
    const handleChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };
    
    // Modern way to add listener (for newer browsers)
    if (mql.addEventListener) {
      mql.addEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mql.addListener(handleChange as any);
    }
    
    // Cleanup function
    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener('change', handleChange);
      } else {
        mql.removeListener(handleChange as any);
      }
    };
  }, []);

  return isMobile;
}
