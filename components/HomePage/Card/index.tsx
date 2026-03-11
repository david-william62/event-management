import { View } from "react-native"
import { Card as PCard, Button, Text, Chip, useTheme } from "react-native-paper"

type CardProps = {
  title: string,
  content: string,
  organiser: string,
  date?: string,
  venue?: string,
  category?: string,
  spotsLeft?: string,
  action: () => void,
}

const CATEGORY_ICONS: Record<string, string> = {
  TECHNICAL: 'laptop',
  CULTURAL: 'palette',
  SPORTS: 'run',
  WORKSHOP: 'tools',
  SEMINAR: 'microphone-variant',
};

export default function Card({ title, content, organiser, date, venue, category, spotsLeft, action }: CardProps) {
  const theme = useTheme();
  const categoryIcon = category ? (CATEGORY_ICONS[category] ?? 'calendar') : 'calendar';

  return (
    <PCard
      style={{
        marginBottom: 16,
        backgroundColor: theme.colors.surface,
      }}
      elevation={2}
    >
      <PCard.Title
        title={title}
        subtitle={`By ${organiser}`}
        titleStyle={{ color: theme.colors.onSurface, fontWeight: '700' }}
        subtitleStyle={{ color: theme.colors.onSurfaceVariant }}
        titleNumberOfLines={2}
      />
      <PCard.Content>
        {/* Meta chips: category, date, venue */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
          {category && (
            <Chip icon={categoryIcon} compact style={{ backgroundColor: theme.colors.secondaryContainer }}>
              <Text variant="labelSmall" style={{ color: theme.colors.onSecondaryContainer }}>
                {category.charAt(0) + category.slice(1).toLowerCase()}
              </Text>
            </Chip>
          )}
          {date && (
            <Chip icon="calendar-outline" compact style={{ backgroundColor: theme.colors.surfaceVariant }}>
              <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>{date}</Text>
            </Chip>
          )}
          {venue && (
            <Chip icon="map-marker-outline" compact style={{ backgroundColor: theme.colors.surfaceVariant }}>
              <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }} numberOfLines={1}>
                {venue}
              </Text>
            </Chip>
          )}
        </View>

        <Text
          style={{ color: theme.colors.onSurfaceVariant, lineHeight: 20 }}
          numberOfLines={3}
        >
          {content}
        </Text>

        {spotsLeft && (
          <Text variant="labelSmall" style={{ color: theme.colors.primary, marginTop: 8 }}>
            {spotsLeft} spots filled
          </Text>
        )}
      </PCard.Content>
      <PCard.Actions>
        <Button
          mode="contained"
          onPress={action}
          buttonColor={theme.colors.primary}
          textColor={theme.colors.onPrimary}
          compact
        >
          View Details
        </Button>
      </PCard.Actions>
    </PCard>
  )
}
