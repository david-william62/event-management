import { DarkTheme, DefaultTheme, type Theme } from '@react-navigation/native';
import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';

// Helper function to convert HSL to hex for react-native-paper
const hslToHex = (hsl: string): string => {
  const match = hsl.match(/hsl\((\d+)\s+(\d+)%\s+(\d+)%\)/);
  if (!match) return '#000000';

  const h = parseInt(match[1]) / 360;
  const s = parseInt(match[2]) / 100;
  const l = parseInt(match[3]) / 100;

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  const r = Math.round(hue2rgb(p, q, h + 1 / 3) * 255);
  const g = Math.round(hue2rgb(p, q, h) * 255);
  const b = Math.round(hue2rgb(p, q, h - 1 / 3) * 255);

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};

export const THEME = {
  light: {
    background: 'hsl(30 38% 96%)',
    foreground: 'hsl(25 30% 20%)',
    card: 'hsl(30 38% 96%)',
    cardForeground: 'hsl(25 30% 20%)',
    popover: 'hsl(30 38% 96%)',
    popoverForeground: 'hsl(25 30% 20%)',
    primary: 'hsl(26 47% 45%)',
    primaryForeground: 'hsl(30 40% 96%)',
    secondary: 'hsl(30 32% 90%)',
    secondaryForeground: 'hsl(25 30% 20%)',
    muted: 'hsl(30 24% 88%)',
    mutedForeground: 'hsl(25 16% 40%)',
    accent: 'hsl(30 32% 90%)',
    accentForeground: 'hsl(25 30% 20%)',
    destructive: 'hsl(10 70% 45%)',
    border: 'hsl(30 24% 82%)',
    input: 'hsl(30 24% 82%)',
    ring: 'hsl(26 47% 45%)',
    radius: '0.625rem',
    chart1: 'hsl(28 56% 52%)',
    chart2: 'hsl(22 40% 42%)',
    chart3: 'hsl(16 32% 36%)',
    chart4: 'hsl(34 60% 58%)',
    chart5: 'hsl(18 52% 48%)',
    text: 'hsl(25 30% 20%)',
    // Material 3 additions
    surface: 'hsl(30 38% 96%)',
    surfaceVariant: 'hsl(30 32% 90%)',
    surfaceDisabled: 'hsl(30 24% 88%)',
    outline: 'hsl(30 24% 82%)',
    outlineVariant: 'hsl(30 20% 88%)',
    error: 'hsl(10 70% 45%)',
    errorContainer: 'hsl(10 60% 92%)',
    onError: 'hsl(30 40% 96%)',
    onErrorContainer: 'hsl(10 70% 25%)',
    tertiary: 'hsl(34 60% 58%)',
    tertiaryContainer: 'hsl(34 50% 90%)',
    onTertiary: 'hsl(30 40% 96%)',
    onTertiaryContainer: 'hsl(34 60% 25%)',
    inverseSurface: 'hsl(25 30% 20%)',
    inverseOnSurface: 'hsl(30 40% 94%)',
    inversePrimary: 'hsl(28 48% 64%)',
    shadow: 'hsl(0 0% 0%)',
    scrim: 'hsl(0 0% 0%)',
    elevation: {
      level0: 'transparent',
      level1: 'hsl(30 38% 98%)',
      level2: 'hsl(30 38% 97%)',
      level3: 'hsl(30 38% 96%)',
      level4: 'hsl(30 38% 95%)',
      level5: 'hsl(30 38% 94%)',
    },
  },
  dark: {
    background: 'hsl(22 22% 12%)',
    foreground: 'hsl(30 40% 94%)',
    card: 'hsl(22 22% 12%)',
    cardForeground: 'hsl(30 40% 94%)',
    popover: 'hsl(22 22% 12%)',
    popoverForeground: 'hsl(30 40% 94%)',
    primary: 'hsl(28 48% 64%)',
    primaryForeground: 'hsl(22 22% 12%)',
    secondary: 'hsl(22 18% 18%)',
    secondaryForeground: 'hsl(30 40% 94%)',
    muted: 'hsl(22 16% 20%)',
    mutedForeground: 'hsl(28 18% 70%)',
    accent: 'hsl(22 18% 18%)',
    accentForeground: 'hsl(30 40% 94%)',
    destructive: 'hsl(10 65% 60%)',
    border: 'hsl(22 16% 24%)',
    input: 'hsl(22 16% 24%)',
    ring: 'hsl(28 48% 64%)',
    radius: '0.625rem',
    chart1: 'hsl(28 56% 58%)',
    chart2: 'hsl(22 44% 50%)',
    chart3: 'hsl(16 36% 44%)',
    chart4: 'hsl(34 62% 64%)',
    chart5: 'hsl(18 56% 54%)',
    text: 'hsl(24 100% 96%)',
    // Material 3 additions
    surface: 'hsl(22 22% 12%)',
    surfaceVariant: 'hsl(22 18% 18%)',
    surfaceDisabled: 'hsl(22 16% 20%)',
    outline: 'hsl(22 16% 24%)',
    outlineVariant: 'hsl(22 14% 28%)',
    error: 'hsl(10 65% 60%)',
    errorContainer: 'hsl(10 60% 20%)',
    onError: 'hsl(22 22% 12%)',
    onErrorContainer: 'hsl(10 65% 85%)',
    tertiary: 'hsl(34 62% 64%)',
    tertiaryContainer: 'hsl(34 50% 22%)',
    onTertiary: 'hsl(22 22% 12%)',
    onTertiaryContainer: 'hsl(34 62% 85%)',
    inverseSurface: 'hsl(30 40% 94%)',
    inverseOnSurface: 'hsl(25 30% 20%)',
    inversePrimary: 'hsl(26 47% 45%)',
    shadow: 'hsl(0 0% 0%)',
    scrim: 'hsl(0 0% 0%)',
    elevation: {
      level0: 'transparent',
      level1: 'hsl(22 22% 15%)',
      level2: 'hsl(22 22% 17%)',
      level3: 'hsl(22 22% 19%)',
      level4: 'hsl(22 22% 21%)',
      level5: 'hsl(22 22% 23%)',
    },
  },
};

export const NAV_THEME: Record<'light' | 'dark', Theme> = {
  light: {
    ...DefaultTheme,
    colors: {
      background: THEME.light.background,
      border: THEME.light.border,
      card: THEME.light.card,
      notification: THEME.light.destructive,
      primary: THEME.light.primary,
      text: THEME.light.foreground,
    },
  },
  dark: {
    ...DarkTheme,
    colors: {
      background: THEME.dark.background,
      border: THEME.dark.border,
      card: THEME.dark.card,
      notification: THEME.dark.destructive,
      primary: THEME.dark.primary,
      text: THEME.dark.foreground,
    },
  },
};

// Material 3 theme for react-native-paper
export const PAPER_THEME: Record<'light' | 'dark', MD3Theme> = {
  light: {
    ...MD3LightTheme,
    colors: {
      ...MD3LightTheme.colors,
      primary: hslToHex(THEME.light.primary),
      onPrimary: hslToHex(THEME.light.primaryForeground),
      primaryContainer: hslToHex(THEME.light.accent),
      onPrimaryContainer: hslToHex(THEME.light.accentForeground),
      secondary: hslToHex(THEME.light.secondary),
      onSecondary: hslToHex(THEME.light.secondaryForeground),
      secondaryContainer: hslToHex(THEME.light.muted),
      onSecondaryContainer: hslToHex(THEME.light.mutedForeground),
      tertiary: hslToHex(THEME.light.tertiary),
      onTertiary: hslToHex(THEME.light.onTertiary),
      tertiaryContainer: hslToHex(THEME.light.tertiaryContainer),
      onTertiaryContainer: hslToHex(THEME.light.onTertiaryContainer),
      error: hslToHex(THEME.light.error),
      onError: hslToHex(THEME.light.onError),
      errorContainer: hslToHex(THEME.light.errorContainer),
      onErrorContainer: hslToHex(THEME.light.onErrorContainer),
      background: hslToHex(THEME.light.background),
      onBackground: hslToHex(THEME.light.foreground),
      surface: hslToHex(THEME.light.surface),
      onSurface: hslToHex(THEME.light.foreground),
      surfaceVariant: hslToHex(THEME.light.surfaceVariant),
      onSurfaceVariant: hslToHex(THEME.light.foreground),
      outline: hslToHex(THEME.light.outline),
      outlineVariant: hslToHex(THEME.light.outlineVariant),
      shadow: hslToHex(THEME.light.shadow),
      scrim: hslToHex(THEME.light.scrim),
      inverseSurface: hslToHex(THEME.light.inverseSurface),
      inverseOnSurface: hslToHex(THEME.light.inverseOnSurface),
      inversePrimary: hslToHex(THEME.light.inversePrimary),
      elevation: {
        level0: hslToHex(THEME.light.elevation.level0),
        level1: hslToHex(THEME.light.elevation.level1),
        level2: hslToHex(THEME.light.elevation.level2),
        level3: hslToHex(THEME.light.elevation.level3),
        level4: hslToHex(THEME.light.elevation.level4),
        level5: hslToHex(THEME.light.elevation.level5),
      },
      surfaceDisabled: hslToHex(THEME.light.surfaceDisabled),
      onSurfaceDisabled: hslToHex(THEME.light.mutedForeground),
      backdrop: 'rgba(0, 0, 0, 0.4)',
    },
  },
  dark: {
    ...MD3DarkTheme,
    colors: {
      ...MD3DarkTheme.colors,
      primary: hslToHex(THEME.dark.primary),
      onPrimary: hslToHex(THEME.dark.primaryForeground),
      primaryContainer: hslToHex(THEME.dark.accent),
      onPrimaryContainer: hslToHex(THEME.dark.accentForeground),
      secondary: hslToHex(THEME.dark.secondary),
      onSecondary: hslToHex(THEME.dark.secondaryForeground),
      secondaryContainer: hslToHex(THEME.dark.muted),
      onSecondaryContainer: hslToHex(THEME.dark.mutedForeground),
      tertiary: hslToHex(THEME.dark.tertiary),
      onTertiary: hslToHex(THEME.dark.onTertiary),
      tertiaryContainer: hslToHex(THEME.dark.tertiaryContainer),
      onTertiaryContainer: hslToHex(THEME.dark.onTertiaryContainer),
      error: hslToHex(THEME.dark.error),
      onError: hslToHex(THEME.dark.onError),
      errorContainer: hslToHex(THEME.dark.errorContainer),
      onErrorContainer: hslToHex(THEME.dark.onErrorContainer),
      background: hslToHex(THEME.dark.background),
      onBackground: hslToHex(THEME.dark.foreground),
      surface: hslToHex(THEME.dark.surface),
      onSurface: hslToHex(THEME.dark.foreground),
      surfaceVariant: hslToHex(THEME.dark.surfaceVariant),
      onSurfaceVariant: hslToHex(THEME.dark.foreground),
      outline: hslToHex(THEME.dark.outline),
      outlineVariant: hslToHex(THEME.dark.outlineVariant),
      shadow: hslToHex(THEME.dark.shadow),
      scrim: hslToHex(THEME.dark.scrim),
      inverseSurface: hslToHex(THEME.dark.inverseSurface),
      inverseOnSurface: hslToHex(THEME.dark.inverseOnSurface),
      inversePrimary: hslToHex(THEME.dark.inversePrimary),
      elevation: {
        level0: hslToHex(THEME.dark.elevation.level0),
        level1: hslToHex(THEME.dark.elevation.level1),
        level2: hslToHex(THEME.dark.elevation.level2),
        level3: hslToHex(THEME.dark.elevation.level3),
        level4: hslToHex(THEME.dark.elevation.level4),
        level5: hslToHex(THEME.dark.elevation.level5),
      },
      surfaceDisabled: hslToHex(THEME.dark.surfaceDisabled),
      onSurfaceDisabled: hslToHex(THEME.dark.mutedForeground),
      backdrop: 'rgba(0, 0, 0, 0.6)',
    },
  },
};