import React from "react"
import Card from "@/components/HomePage/Card"
import { ScrollView, View, ActivityIndicator } from "react-native"
import { Text, useTheme } from "react-native-paper"
import { useNavigation } from "@/lib/navigation-context"
import { gql } from "@apollo/client"
import { useQuery } from "@apollo/client/react"

const APPROVED_EVENTS_QUERY = gql`
  query GetApprovedEvents {
    approvedEvents {
      id
      title
      description
      startTime
      endTime
      venue
      category
      registrationEnd
      contactEmail
      maxParticipants
      participantCount
      status
      organizer {
        firstName
        lastName
      }
    }
  }
`;

export default function HomePage() {
  const { setCurrentRoute, setEventData } = useNavigation()
  const theme = useTheme()

  const { data, loading, error } = useQuery(APPROVED_EVENTS_QUERY, {
    fetchPolicy: "cache-and-network",
  });

  const handleEventPress = (event: any) => {
    setEventData({
      id: event.id,
      title: event.title,
      organiser: event.organizer
        ? `${event.organizer.firstName} ${event.organizer.lastName}`
        : 'Unknown',
      description: event.description,
      date: new Date(event.startTime).toLocaleDateString(),
      time: new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      venue: event.venue,
      category: event.category,
      registrationDeadline: new Date(event.registrationEnd).toLocaleDateString(),
      registrationEndISO: event.registrationEnd,
      contactEmail: event.contactEmail ?? '',
      maxParticipants: `${event.participantCount} / ${event.maxParticipants}`,
    })
    setCurrentRoute('eventDetails')
  }

  if (loading && !data) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator animating size="large" color={theme.colors.primary} />
      </View>
    )
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: theme.colors.background }}>
        <Text variant="bodyLarge" style={{ color: theme.colors.error, textAlign: 'center' }}>
          Failed to load events. {error.message}
        </Text>
      </View>
    )
  }

  const events = data?.approvedEvents || [];

  if (events.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant }}>
          No upcoming events.
        </Text>
      </View>
    )
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      contentContainerStyle={{ padding: 16 }}
    >
      <Text variant="headlineMedium" style={{ fontWeight: "bold", color: theme.colors.onBackground, marginBottom: 16 }}>
        Events Feed
      </Text>
      {events.map((event: any) => (
        <Card
          key={event.id}
          title={event.title}
          organiser={event.organizer
            ? `${event.organizer.firstName} ${event.organizer.lastName}`
            : 'Unknown'}
          content={event.description}
          date={new Date(event.startTime).toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' })}
          venue={event.venue}
          category={event.category}
          spotsLeft={event.maxParticipants > 0 ? `${event.participantCount} / ${event.maxParticipants}` : undefined}
          action={() => handleEventPress(event)}
        />
      ))}
      <View style={{ height: 100 }} />
    </ScrollView>
  )
}