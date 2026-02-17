import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';

type EventData = {
  id: string;
  title: string;
  organiser: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  category: string;
  registrationDeadline: string;
  contactEmail: string;
  maxParticipants: string;
};

type NavigationContextType = {
  currentRoute: string;
  navigate: (route: string) => void;
  setCurrentRoute: (route: string) => void;
  currentIndex: number;
  eventData: EventData | null;
  setEventData: (data: EventData | null) => void;
};

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider = ({
  children,
  initialRoute = 'home'
}: {
  children: ReactNode;
  initialRoute?: string;
}) => {
  const [currentRoute, setCurrentRoute] = useState(initialRoute);
  const [eventData, setEventData] = useState<EventData | null>(null);

  const navigate = useCallback((route: string) => {
    setCurrentRoute(route);
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    currentRoute,
    navigate,
    setCurrentRoute,
    currentIndex: 0, // This will be calculated in the consumer
    eventData,
    setEventData,
  }), [currentRoute, navigate, eventData]);

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
