import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Button, Surface, Divider, useTheme } from 'react-native-paper';
import { useNavigation } from '@/lib/navigation-context';

type EventDetailsProps = {
  eventId?: string;
  title: string;
  organiser: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  category: string;
  registrationDeadline: string;
  contactEmail: string;
  maxParticipants: string;
};

export default function EventDetails({
  eventId,
  title,
  organiser,
  description,
  date,
  time,
  venue,
  category,
  registrationDeadline,
  contactEmail,
  maxParticipants
}: EventDetailsProps) {
  const { setCurrentRoute } = useNavigation();
  const theme = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        {/* Header */}
        <Surface style={[styles.headerSurface, { backgroundColor: theme.colors.elevation.level2 }]} elevation={1}>
          <Text variant="headlineMedium" style={{ color: theme.colors.onSurface, marginBottom: 8 }}>
            {title}
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            Organized by: {organiser}
          </Text>
        </Surface>

        {/* Event Details */}
        <Surface style={[styles.section, { backgroundColor: theme.colors.surface }]} elevation={1}>
          <Text variant="titleLarge" style={{ color: theme.colors.onSurface, marginBottom: 16 }}>
            Event Details
          </Text>

          <View style={styles.detailRow}>
            <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant, minWidth: 160 }}>
              Category:
            </Text>
            <Text variant="bodyLarge" style={{ color: theme.colors.onSurface, flex: 1 }}>
              {category}
            </Text>
          </View>

          <Divider style={{ marginVertical: 8 }} />

          <View style={styles.detailRow}>
            <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant, minWidth: 160 }}>
              Date:
            </Text>
            <Text variant="bodyLarge" style={{ color: theme.colors.onSurface, flex: 1 }}>
              {date}
            </Text>
          </View>

          <Divider style={{ marginVertical: 8 }} />

          <View style={styles.detailRow}>
            <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant, minWidth: 160 }}>
              Time:
            </Text>
            <Text variant="bodyLarge" style={{ color: theme.colors.onSurface, flex: 1 }}>
              {time}
            </Text>
          </View>

          <Divider style={{ marginVertical: 8 }} />

          <View style={styles.detailRow}>
            <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant, minWidth: 160 }}>
              Venue:
            </Text>
            <Text variant="bodyLarge" style={{ color: theme.colors.onSurface, flex: 1 }}>
              {venue}
            </Text>
          </View>

          <Divider style={{ marginVertical: 8 }} />

          <View style={styles.detailRow}>
            <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant, minWidth: 160 }}>
              Max Participants:
            </Text>
            <Text variant="bodyLarge" style={{ color: theme.colors.onSurface, flex: 1 }}>
              {maxParticipants}
            </Text>
          </View>

          <Divider style={{ marginVertical: 8 }} />

          <View style={styles.detailRow}>
            <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant, minWidth: 160 }}>
              Registration Deadline:
            </Text>
            <Text variant="bodyLarge" style={{ color: theme.colors.onSurface, flex: 1 }}>
              {registrationDeadline}
            </Text>
          </View>
        </Surface>

        {/* Description */}
        <Surface style={[styles.section, { backgroundColor: theme.colors.surface }]} elevation={1}>
          <Text variant="titleLarge" style={{ color: theme.colors.onSurface, marginBottom: 12 }}>
            About This Event
          </Text>
          <Text variant="bodyLarge" style={{ color: theme.colors.onSurface, lineHeight: 24 }}>
            {description}
          </Text>
        </Surface>

        {/* Contact Information */}
        <Surface style={[styles.section, { backgroundColor: theme.colors.surface }]} elevation={1}>
          <Text variant="titleLarge" style={{ color: theme.colors.onSurface, marginBottom: 12 }}>
            Contact Information
          </Text>
          <Text variant="bodyLarge" style={{ color: theme.colors.primary }}>
            {contactEmail}
          </Text>
        </Surface>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={() => {/* Handle registration */ }}
            style={styles.registerButton}
            buttonColor={theme.colors.primary}
            textColor={theme.colors.onPrimary}
          >
            Register Now
          </Button>

          <Button
            mode="outlined"
            onPress={() => setCurrentRoute('home')}
            style={styles.backButton}
            textColor={theme.colors.primary}
          >
            Back to Events
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  headerSurface: {
    padding: 20,
    marginBottom: 16,
    borderRadius: 12,
  },
  section: {
    padding: 20,
    marginBottom: 16,
    borderRadius: 12,
  },
  detailRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  buttonContainer: {
    marginTop: 16,
    gap: 12,
  },
  registerButton: {
    marginBottom: 8,
  },
  backButton: {
    marginBottom: 8,
  },
});
