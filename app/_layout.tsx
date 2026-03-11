import { BottomBar as Navbar } from '@/components/Navbar';
import '@/global.css';

import { NAV_THEME, PAPER_THEME } from '@/lib/theme';
import { ThemeProvider } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { House, User, LayoutDashboard, Shield } from "lucide-react-native";
import { View, Text } from 'react-native';
import { NavigationProvider, useNavigation as useNav } from '@/lib/navigation-context';
import { ApolloProvider } from '@apollo/client/react';
import { apolloClient } from '@/lib/apollo';

export {
  ErrorBoundary,
} from 'expo-router';

const baseNavlinks = [
  { key: 'home', title: 'Home', icon: House },
  { key: 'dashboard', title: 'Dashboard', icon: LayoutDashboard },
  { key: 'profile', title: 'Profile', icon: User },
];

function NavbarWithRole() {
  const { authUser, currentRoute } = useNav();
  const isAdminOrMgmt = authUser?.role === 'ADMIN' || authUser?.role === 'MANAGEMENT';
  const isAuthRoute = currentRoute === 'login' || currentRoute === 'register';

  if (isAuthRoute || !authUser) return null;

  const navlinks = isAdminOrMgmt
    ? [
      { key: 'home', title: 'Home', icon: House },
      { key: 'dashboard', title: 'Dashboard', icon: LayoutDashboard },
      { key: 'admin', title: authUser.role === 'ADMIN' ? 'Admin' : 'Manage', icon: Shield },
      { key: 'profile', title: 'Profile', icon: User },
    ]
    : baseNavlinks;

  return <Navbar navlinks={navlinks} />;
}

export default function RootLayout() {
  const { colorScheme } = useColorScheme();

  return (
    <ApolloProvider client={apolloClient}>
      <NavigationProvider initialRoute="home">
        <PaperProvider theme={PAPER_THEME[colorScheme ?? 'light']}>
          <ThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
            <Stack />
            <PortalHost />
            <NavbarWithRole />
          </ThemeProvider>
        </PaperProvider>
      </NavigationProvider>
    </ApolloProvider>
  );
}
