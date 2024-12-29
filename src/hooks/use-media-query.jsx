"use client"

import { useEffect, useState } from 'react';  

const useMediaQuery = (query) => {  
  const [matches, setMatches] = useState(() => {  
    if (typeof window !== 'undefined') {  
      return window.matchMedia(query).matches;  
    }  
    return false;  
  });  
  
  useEffect(() => {  
    const mediaQueryList = window.matchMedia(query);  

    const documentChangeHandler = () => setMatches(mediaQueryList.matches);  

    mediaQueryList.addEventListener('change', documentChangeHandler);  

    // Initial check  
    setMatches(mediaQueryList.matches);  

    return () => {  
      mediaQueryList.removeEventListener('change', documentChangeHandler);  
    };  
  }, [query]);  

  return matches;  
};  

export default useMediaQuery;  
