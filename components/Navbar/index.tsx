import { BottomNavigation, Icon, Provider } from "react-native-paper";
import { } from "phosphor-react-native";
import React from "react";
import { useColorScheme } from "nativewind";
import { THEME } from "@/lib/theme";
import { useNavigation } from "@/lib/navigation-context";


const Sidebar = () => {
  const [index, setIndex] = React.useState(0);

  return (
    <div></div>
  )
}

export const BottomBar = ({ navlinks }: { navlinks: Array<{ key: string; title: string; icon: React.ElementType }> }) => {
  const { currentRoute, navigate } = useNavigation();
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? 'light'];

  // Calculate the current index based on the route from context
  const currentIndex = React.useMemo(() => {
    const idx = navlinks.findIndex((r) => r.key === currentRoute);
    return idx !== -1 ? idx : 0;
  }, [currentRoute, navlinks]);

  return (
    <BottomNavigation.Bar
      navigationState={{ index: currentIndex, routes: navlinks }}
      onTabPress={({ route }) => {
        navigate(route.key);
      }}
      activeColor={theme.primary}
      inactiveColor={theme.mutedForeground}
      style={{ backgroundColor: theme.secondary, borderTopWidth: 2, borderTopColor: theme.border }}
      renderIcon={({ route, color }) => (
        <route.icon color={color} size={24} />
      )}
      getLabelText={({ route }) => route.title}
    />
  )
}