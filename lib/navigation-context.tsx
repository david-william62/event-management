import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { loadStoredAuth, type AuthUser } from './auth';

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
  registrationEndISO: string;
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
  authUser: AuthUser | null;
  setAuthUser: (user: AuthUser | null) => void;
  isAuthLoading: boolean;
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
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [authUser, setAuthUserState] = useState<AuthUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Restore stored session on mount
  useEffect(() => {
    loadStoredAuth().then((user) => {
      if (user) {
        setAuthUserState(user);
      } else {
        setCurrentRoute('login');
      }
    }).finally(() => setIsAuthLoading(false));
  }, []);

  const setAuthUser = useCallback((user: AuthUser | null) => {
    setAuthUserState(user);
    if (!user) setCurrentRoute('login');
  }, []);

  const navigate = useCallback((route: string) => {
    setCurrentRoute(route);
  }, []);

  const value = useMemo(() => ({
    currentRoute,
    navigate,
    setCurrentRoute,
    currentIndex: 0,
    eventData,
    setEventData,
    authUser,
    setAuthUser,
    isAuthLoading,
  }), [currentRoute, navigate, eventData, authUser, setAuthUser, isAuthLoading]);

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
