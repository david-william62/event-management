import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Stack } from 'expo-router';
import { MoonStarIcon, SunIcon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { ActivityIndicator, View } from 'react-native';

import HomePage from './Pages/Home';
import EventDetails from './Pages/EventDetails';
import ProfileScreen from './Pages/Profile';
import Dashboard from './Pages/Dashboard';
import CreateEvent from './Pages/Dashboard/CreateEvent';
import LoginScreen from './Pages/Auth/Login';
import RegisterScreen from './Pages/Auth/Register';
import AdminPanel from './Pages/Admin';

import { useNavigation } from '@/lib/navigation-context';
import { THEME } from '@/lib/theme';

const SCREEN_OPTIONS = {
  title: '',
  headerTransparent: true,
  headerRight: () => <ThemeToggle />,
};

export default function Screen() {
  const { colorScheme } = useColorScheme();
  const { currentRoute, eventData, authUser, isAuthLoading } = useNavigation();

  // Show a centered spinner while we check SecureStore for a stored token
  if (isAuthLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const renderPage = (key: string) => {
    // Auth routes — always available regardless of login state
    if (key === 'login') return <LoginScreen />;
    if (key === 'register') return <RegisterScreen />;

    // If not authenticated redirect to login
    if (!authUser) return <LoginScreen />;

    switch (key) {
      case 'home':
        return <HomePage />;
      case 'eventDetails':
        return eventData ? <EventDetails {...eventData} /> : <HomePage />;
      case 'dashboard':
        return <Dashboard />;
      case 'createEvent':
        return <CreateEvent />;
      case 'profile':
        return <ProfileScreen />;
      case 'admin':
        return <AdminPanel />;
      default:
        return <HomePage />;
    }
  };

  return (
    <>
      <Stack.Screen options={SCREEN_OPTIONS} />
      <View style={{ flex: 1 }}>
        {renderPage(currentRoute)}
      </View>
    </>
  );
}

const THEME_ICONS = {
  light: SunIcon,
  dark: MoonStarIcon,
};

function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  return (
    <Button
      onPressIn={toggleColorScheme}
      size="icon"
      variant="ghost"
      className="ios:size-9 rounded-full web:mx-4">
      <Icon as={THEME_ICONS[colorScheme ?? 'light']} className="size-5" />
    </Button>
  );
}
