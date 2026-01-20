import { BottomBar as Navbar } from '@/components/Navbar';
import '@/global.css';

import { NAV_THEME } from '@/lib/theme';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { House, User } from "lucide-react-native";
import { View, Text } from 'react-native';
import { NavigationProvider } from '@/lib/navigation-context';

export {
  ErrorBoundary,
} from 'expo-router';

const navlinks = [
  { key: 'home', title: 'Home', icon: House },
  // { key: 'search', title: 'Search', icon: 'magnify' },
  // { key: 'notifications', title: 'Notifications', icon: 'bell' },
  { key: 'profile', title: 'Profile', icon: User },
]

export default function RootLayout() {
  const { colorScheme } = useColorScheme();

  return (
    <NavigationProvider initialRoute="home">
      <ThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        <Stack />
        <PortalHost />
        <Navbar navlinks={navlinks} />
      </ThemeProvider>
    </NavigationProvider>
  );
}
