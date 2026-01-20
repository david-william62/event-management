import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Link, Stack } from 'expo-router';
import { MoonStarIcon, StarIcon, SunIcon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { Image, type ImageStyle, View } from 'react-native';
import { House, User } from "phosphor-react-native"

const LOGO = {
  light: require('@/assets/images/react-native-reusables-light.png'),
  dark: require('@/assets/images/react-native-reusables-dark.png'),
};

const SCREEN_OPTIONS = {
  title: 'Event Manager',
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

export default function Screen() {
  const { colorScheme } = useColorScheme();

  const renderPage = (key: string) => {
    switch (key) {
      case 'home':
        return <View><Text style={{ color: "white" }}>Home Page</Text></View>;
      case 'profile':
        return <View><Text style={{ color: "white" }}>Profile Page</Text></View>;
      default:
        return <View><Text style={{ color: "white" }}>Home Page</Text></View>;
    }
  }

  return (
    <>
      <Stack.Screen options={SCREEN_OPTIONS} />
      <View className="flex-1 items-center justify-center gap-8 p-4">
        {renderPage(navlinks[0].key)}
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
