import { BottomNavigation, Icon, Provider } from "react-native-paper";
import { } from "phosphor-react-native";
import React from "react";
import { useColorScheme } from "nativewind";
import { THEME } from "@/lib/theme";


const Sidebar = () => {
  const [index, setIndex] = React.useState(0);

  return (
    <div></div>
  )
}

export const BottomBar = ({ navlinks }: { navlinks: Array<{ key: string; title: string; icon: React.ElementType }> }) => {
  const [index, setIndex] = React.useState(0);
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? 'light'];

  return (
    <BottomNavigation.Bar
      navigationState={{ index, routes: navlinks }}
      onTabPress={({ route }) => {
        const newIndex = navlinks.findIndex((r) => r.key === route.key);
        if (newIndex !== -1) {
          setIndex(newIndex);
        }
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