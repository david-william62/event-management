import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

type NavigationContextType = {
  currentRoute: string;
  navigate: (route: string) => void;
  currentIndex: number;
};

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider = ({ 
  children, 
  initialRoute = 'home' 
}: { 
  children: React.ReactNode; 
  initialRoute?: string;
}) => {
  const [currentRoute, setCurrentRoute] = useState(initialRoute);

  const navigate = useCallback((route: string) => {
    setCurrentRoute(route);
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    currentRoute,
    navigate,
    currentIndex: 0, // This will be calculated in the consumer
  }), [currentRoute, navigate]);

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

export { NavigationContext };
