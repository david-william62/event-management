import { Card as PCard, Button, Text, useTheme } from "react-native-paper"

type CardProps = {
  title: string,
  content: string,
  organiser: string,
  action: () => void,
}

export default function Card({ title, content, organiser, action }: CardProps) {
  const theme = useTheme();

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
        subtitle={`Organized by: ${organiser}`}
        titleStyle={{ color: theme.colors.onSurface }}
        subtitleStyle={{ color: theme.colors.onSurfaceVariant }}
      />
      <PCard.Content>
        <Text style={{ color: theme.colors.onSurface }}>{content}</Text>
      </PCard.Content>
      <PCard.Actions>
        <Button
          mode="contained"
          onPress={action}
          buttonColor={theme.colors.primary}
          textColor={theme.colors.onPrimary}
        >
          View Details
        </Button>
      </PCard.Actions>
    </PCard>
  )
} 