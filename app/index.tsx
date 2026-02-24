import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Link, Stack } from 'expo-router';
import { MoonStarIcon, StarIcon, SunIcon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { Image, type ImageStyle, View } from 'react-native';
import { House, User } from "phosphor-react-native"
import { useNavigation } from '@/lib/navigation-context';
import { THEME } from '@/lib/theme';

const LOGO = {
  light: require('@/assets/images/react-native-reusables-light.png'),
  dark: require('@/assets/images/react-native-reusables-dark.png'),
};

const SCREEN_OPTIONS = {
  title: '',
  headerTransparent: true,
  headerRight: () => <ThemeToggle />,
};

const IMAGE_STYLE: ImageStyle = {
  height: 76,
  width: 76,
};

const navlinks = [
  { key: 'home', title: 'Home', icon: House },
  // { key: 'search', title: 'Search', icon: 'magnify' },
  // { key: 'notifications', title: 'Notifications', icon: 'bell' },
  { key: 'profile', title: 'Profile', icon: User },
]

import HomePage from './Pages/Home';
import EventDetails from './Pages/EventDetails';
import ProfileScreen from './Pages/Profile';

export default function Screen() {
  const { colorScheme } = useColorScheme();
  const { currentRoute, eventData } = useNavigation();
  const theme = THEME[colorScheme ?? 'light'];

  const renderPage = React.useCallback((key: string) => {
    switch (key) {
      case 'home':
        return <HomePage />;
      case 'eventDetails':
        if (!eventData) {
          return <HomePage />;
        }
        return <EventDetails {...eventData} />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <HomePage />;
    }
  }, [theme, eventData]);

  return (
    <>
      <Stack.Screen options={SCREEN_OPTIONS} />
      <View className={currentRoute === 'profile' ? 'flex-1' : 'flex-1 items-center justify-center gap-8 p-4'}>
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
