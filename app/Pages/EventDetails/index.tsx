import { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Text, Button, Surface, Divider, Chip, useTheme } from 'react-native-paper';
import { useNavigation } from '@/lib/navigation-context';
import { api } from '@/lib/api';

type EventDetailsProps = {
  id?: string;
  title: string;
  organiser: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  category: string;
  registrationDeadline: string;
  registrationEndISO?: string;
  contactEmail: string;
  maxParticipants: string;
};

export default function EventDetails({
  id,
  title,
  organiser,
  description,
  date,
  time,
  venue,
  category,
  registrationDeadline,
  registrationEndISO,
  contactEmail,
  maxParticipants
}: EventDetailsProps) {
  const { setCurrentRoute } = useNavigation();
  const theme = useTheme();
  const [registering, setRegistering] = useState(false);
  const [registered, setRegistered] = useState(false);

  const registrationClosed = registrationEndISO
    ? new Date(registrationEndISO) < new Date()
    : false;

  const handleRegister = async () => {
    if (!id) {
      Alert.alert('Error', 'Event ID is missing.');
      return;
    }
    try {
      setRegistering(true);
      await api.post(`/api/events/${id}/register`);
      setRegistered(true);
      Alert.alert('Registered!', 'You have successfully registered for this event.');
    } catch (err: any) {
      Alert.alert('Registration Failed', err.message ?? 'Could not register for this event.');
    } finally {
      setRegistering(false);
    }
  };

  const registerButtonLabel = registered
    ? 'Registered ✓'
    : registrationClosed
      ? 'Registration Closed'
      : 'Register Now';

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        {/* Header */}
        <Surface style={[styles.headerSurface, { backgroundColor: theme.colors.elevation.level2 }]} elevation={1}>
          <Text variant="headlineMedium" style={{ color: theme.colors.onSurface, marginBottom: 8, fontWeight: '700' }}>
            {title}
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 10 }}>
            Organized by: {organiser}
          </Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Chip icon="tag-outline" compact style={{ backgroundColor: theme.colors.secondaryContainer }}>
              <Text variant="labelSmall" style={{ color: theme.colors.onSecondaryContainer }}>
                {category.charAt(0) + category.slice(1).toLowerCase()}
              </Text>
            </Chip>
            {registrationClosed ? (
              <Chip icon="lock-outline" compact style={{ backgroundColor: theme.colors.errorContainer }}>
                <Text variant="labelSmall" style={{ color: theme.colors.onErrorContainer }}>Registration Closed</Text>
              </Chip>
            ) : (
              <Chip icon="check-circle-outline" compact style={{ backgroundColor: theme.colors.primaryContainer }}>
                <Text variant="labelSmall" style={{ color: theme.colors.onPrimaryContainer }}>Open</Text>
              </Chip>
            )}
          </View>
        </Surface>

        {/* Event Details */}
        <Surface style={[styles.section, { backgroundColor: theme.colors.surface }]} elevation={1}>
          <Text variant="titleLarge" style={{ color: theme.colors.onSurface, marginBottom: 16 }}>
            Event Details
          </Text>

          {[
            { label: 'Date', value: date },
            { label: 'Time', value: time },
            { label: 'Venue', value: venue },
            { label: 'Participants', value: maxParticipants },
            { label: 'Reg. Deadline', value: registrationDeadline },
          ].map(({ label, value }, i) => (
            <View key={label}>
              {i > 0 && <Divider style={{ marginVertical: 8 }} />}
              <View style={styles.detailRow}>
                <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant, minWidth: 120 }}>
                  {label}
                </Text>
                <Text variant="bodyLarge" style={{ color: theme.colors.onSurface, flex: 1 }}>
                  {value}
                </Text>
              </View>
            </View>
          ))}
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
        {contactEmail ? (
          <Surface style={[styles.section, { backgroundColor: theme.colors.surface }]} elevation={1}>
            <Text variant="titleLarge" style={{ color: theme.colors.onSurface, marginBottom: 12 }}>
              Contact Information
            </Text>
            <Text variant="bodyLarge" style={{ color: theme.colors.primary }}>
              {contactEmail}
            </Text>
          </Surface>
        ) : null}

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleRegister}
            loading={registering}
            disabled={registering || registered || registrationClosed}
            style={styles.registerButton}
            buttonColor={
              registered ? theme.colors.secondary
              : registrationClosed ? theme.colors.surfaceVariant
              : theme.colors.primary
            }
            textColor={
              registrationClosed && !registered
                ? theme.colors.onSurfaceVariant
                : theme.colors.onPrimary
            }
          >
            {registerButtonLabel}
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
  container: { flex: 1 },
  content: { padding: 20 },
  headerSurface: { padding: 20, marginBottom: 16, borderRadius: 12 },
  section: { padding: 20, marginBottom: 16, borderRadius: 12 },
  detailRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start' },
  buttonContainer: { marginTop: 16, gap: 12 },
  registerButton: { marginBottom: 8 },
  backButton: { marginBottom: 8 },
});
