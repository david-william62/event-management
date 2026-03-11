import React from "react";
import { ScrollView, View, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { Text, useTheme, Surface, FAB, Button, Chip, Divider } from "react-native-paper";
import { useNavigation } from "@/lib/navigation-context";
import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";

const APPROVE_EVENT = gql`
  mutation ApproveEvent($id: ID!) {
    approveEvent(id: $id) {
      id
      status
    }
  }
`;

const REJECT_EVENT = gql`
  mutation RejectEvent($id: ID!) {
    rejectEvent(id: $id) {
      id
      status
    }
  }
`;

const VERIFY_USER = gql`
  mutation VerifyUser($userId: ID!) {
    verifyUser(userId: $userId) {
      id
      isVerified
      firstName
      lastName
    }
  }
`;

const DASHBOARD_QUERY = gql`
  query GetDashboardData {
    me {
      id
      role
      subRole
      firstName
      lastName
      isVerified
      collegeName
    }
    myEvents {
      id
      title
      status
      startTime
      category
      participantCount
      maxParticipants
      venue
    }
    allEvents {
      id
      title
      status
      startTime
      category
      venue
      organizer {
        firstName
        lastName
      }
    }
    pendingApprovals {
      id
      firstName
      lastName
      email
      role
      department
      collegeName
      isVerified
    }
    collegeAnalytics {
      totalEvents
      approvedEvents
      pendingEvents
      totalParticipants
    }
    myDepartmentAnalytics {
      totalEvents
      approvedEvents
      pendingEvents
      totalParticipants
    }
  }
`;

export default function Dashboard() {
  const theme = useTheme();
  const { setCurrentRoute, authUser } = useNavigation();

  const { data, loading, error } = useQuery(DASHBOARD_QUERY, {
    fetchPolicy: "network-only",
  });

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (error || !data?.me) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.error }}>Error loading dashboard data.</Text>
      </View>
    );
  }

  const { me, myEvents, allEvents, pendingApprovals, collegeAnalytics, myDepartmentAnalytics } = data;
  const isStudent = me.role === "STUDENT";
  const isFaculty = me.role === "FACULTY";
  const isHOD = me.role === "HOD";
  const isManagement = me.role === "MANAGEMENT";
  const isAdmin = me.role === "ADMIN";

  // Filter events logically
  const pendingFaculty = allEvents.filter((e: any) => e.status === "PENDING_FACULTY");
  const pendingHOD = allEvents.filter((e: any) => e.status === "PENDING_HOD");
  const pendingManagement = allEvents.filter((e: any) => e.status === "PENDING_MANAGEMENT");

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text variant="headlineMedium" style={{ fontWeight: "bold", color: theme.colors.onBackground }}>
            Dashboard
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
            <Chip icon="account" compact>{me.role}</Chip>
            {me.subRole !== "NONE" && <Chip compact>{me.subRole}</Chip>}
            {!me.isVerified && (
              <Chip icon="alert-circle" compact textStyle={{ color: '#E67E22' }}>Unverified</Chip>
            )}
          </View>
          {me.collegeName && (
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
              {me.collegeName}
            </Text>
          )}
        </View>

        {/* Unverified banner */}
        {!me.isVerified && (
          <Surface style={[styles.card, { backgroundColor: '#FFF3E0' }]} elevation={0}>
            <Text variant="bodyMedium" style={{ color: '#E65100' }}>
              Your account is pending verification. Some features may be limited until approved by your institution.
            </Text>
          </Surface>
        )}

        {/* Admin quick actions */}
        {(isAdmin || isManagement) && (
          <View style={{ marginBottom: 16 }}>
            <Button
              mode="contained-tonal"
              icon="shield-crown"
              onPress={() => setCurrentRoute('admin')}
              contentStyle={{ justifyContent: 'flex-start' }}
            >
              {isAdmin ? 'Open Admin Panel' : 'Open Management Panel'}
            </Button>
          </View>
        )}

        {isStudent && (
          <StudentDashboard myEvents={myEvents} />
        )}

        {isFaculty && (
          <FacultyDashboard pendingEvents={pendingFaculty} />
        )}

        {isHOD && (
          <HODDashboard pendingEvents={pendingHOD} analytics={myDepartmentAnalytics} />
        )}

        {(isManagement || isAdmin) && (
          <ManagementDashboard
            pendingEvents={pendingManagement}
            analytics={collegeAnalytics}
            isAdmin={isAdmin}
          />
        )}

        {/* User Approval Section (for non-students). */}
        {!isStudent && pendingApprovals && pendingApprovals.length > 0 && (
          <>
            <Divider style={{ marginVertical: 16 }} />
            <PendingUserApprovals users={pendingApprovals} />
          </>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {!isAdmin && (
        <FAB
          icon="plus"
          style={[styles.fab, { backgroundColor: theme.colors.primaryContainer }]}
          color={theme.colors.onPrimaryContainer}
          onPress={() => setCurrentRoute("createEvent")}
          label="New Event"
        />
      )}
    </View>
  );
}

// Subcomponents for each role
const StudentDashboard = ({ myEvents }: { myEvents: any[] }) => {
  const theme = useTheme();
  return (
    <View style={styles.section}>
      <Text variant="titleMedium" style={styles.sectionTitle}>My Event Requests</Text>
      {myEvents.length === 0 ? (
        <Text>You have not drafted any events.</Text>
      ) : (
        myEvents.map((ev) => (
          <Surface key={ev.id} style={styles.card} elevation={1}>
            <Text variant="titleMedium">{ev.title}</Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              Status: {ev.status} • {new Date(ev.startTime).toLocaleDateString()}
            </Text>
          </Surface>
        ))
      )}
    </View>
  );
};

const FacultyDashboard = ({ pendingEvents }: { pendingEvents: any[] }) => {
  const theme = useTheme();
  const [approveEvent] = useMutation(APPROVE_EVENT, {
    refetchQueries: [DASHBOARD_QUERY],
    onError: (err) => Alert.alert("Error", err.message ?? "Failed to approve event."),
  });
  const [rejectEvent] = useMutation(REJECT_EVENT, {
    refetchQueries: [DASHBOARD_QUERY],
    onError: (err) => Alert.alert("Error", err.message ?? "Failed to reject event."),
  });

  return (
    <View style={styles.section}>
      <Text variant="titleMedium" style={styles.sectionTitle}>Pending Approvals (Student Events)</Text>
      {pendingEvents.length === 0 ? (
        <Text>No events pending your approval.</Text>
      ) : (
        pendingEvents.map((ev) => (
          <Surface key={ev.id} style={styles.card} elevation={1}>
            <Text variant="titleMedium">{ev.title}</Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 8 }}>
              Requested by {ev.organizer.firstName} {ev.organizer.lastName}
            </Text>
            <View style={{ flexDirection: "row", gap: 8, justifyContent: "flex-end" }}>
              <Button mode="text" onPress={() => rejectEvent({ variables: { id: ev.id } })} textColor={theme.colors.error}>Reject</Button>
              <Button mode="contained" onPress={() => approveEvent({ variables: { id: ev.id } })}>Approve</Button>
            </View>
          </Surface>
        ))
      )}
    </View>
  );
};

const HODDashboard = ({ pendingEvents, analytics }: { pendingEvents: any[], analytics: any }) => {
  const theme = useTheme();
  const [approveEvent] = useMutation(APPROVE_EVENT, {
    refetchQueries: [DASHBOARD_QUERY],
    onError: (err) => Alert.alert("Error", err.message ?? "Failed to approve event."),
  });
  const [rejectEvent] = useMutation(REJECT_EVENT, {
    refetchQueries: [DASHBOARD_QUERY],
    onError: (err) => Alert.alert("Error", err.message ?? "Failed to reject event."),
  });

  return (
    <View style={styles.section}>
      <AnalyticsGrid data={analytics} />
      <Text variant="titleMedium" style={[styles.sectionTitle, { marginTop: 24 }]}>Department Approvals</Text>
      {pendingEvents.length === 0 ? (
        <Text>No department events pending HOD approval.</Text>
      ) : (
        pendingEvents.map((ev) => (
          <Surface key={ev.id} style={styles.card} elevation={1}>
            <Text variant="titleMedium">{ev.title}</Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 8 }}>
              Requested by {ev.organizer.firstName} {ev.organizer.lastName}
            </Text>
            <View style={{ flexDirection: "row", gap: 8, justifyContent: "flex-end" }}>
              <Button mode="text" onPress={() => rejectEvent({ variables: { id: ev.id } })} textColor={theme.colors.error}>Reject</Button>
              <Button mode="contained" onPress={() => approveEvent({ variables: { id: ev.id } })}>Approve</Button>
            </View>
          </Surface>
        ))
      )}
    </View>
  );
};

const ManagementDashboard = ({ pendingEvents, analytics, isAdmin }: { pendingEvents: any[], analytics: any, isAdmin?: boolean }) => {
  const theme = useTheme();
  const [approveEvent] = useMutation(APPROVE_EVENT, {
    refetchQueries: [DASHBOARD_QUERY],
    onError: (err) => Alert.alert("Error", err.message ?? "Failed to approve event."),
  });
  const [rejectEvent] = useMutation(REJECT_EVENT, {
    refetchQueries: [DASHBOARD_QUERY],
    onError: (err) => Alert.alert("Error", err.message ?? "Failed to reject event."),
  });

  return (
    <View style={styles.section}>
      <AnalyticsGrid data={analytics} title={isAdmin ? "System Overview" : "College Overview"} />
      <Text variant="titleMedium" style={[styles.sectionTitle, { marginTop: 24 }]}>Organization Approvals</Text>
      {pendingEvents.length === 0 ? (
        <Text>No organization events pending management approval.</Text>
      ) : (
        pendingEvents.map((ev) => (
          <Surface key={ev.id} style={styles.card} elevation={1}>
            <Text variant="titleMedium">{ev.title}</Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 8 }}>
              Requested by {ev.organizer.firstName} {ev.organizer.lastName}
            </Text>
            <View style={{ flexDirection: "row", gap: 8, justifyContent: "flex-end" }}>
              <Button mode="text" onPress={() => rejectEvent({ variables: { id: ev.id } })} textColor={theme.colors.error}>Reject</Button>
              <Button mode="contained" onPress={() => approveEvent({ variables: { id: ev.id } })}>Approve</Button>
            </View>
          </Surface>
        ))
      )}
    </View>
  );
};

// ─── Pending User Approvals ──────────────────────────────────────────────────

const PendingUserApprovals = ({ users }: { users: any[] }) => {
  const theme = useTheme();
  const [verifyUser] = useMutation(VERIFY_USER, {
    refetchQueries: [DASHBOARD_QUERY],
    onCompleted: () => Alert.alert("Success", "User verified."),
    onError: (err) => Alert.alert("Error", err.message ?? "Failed to verify user."),
  });

  return (
    <View style={styles.section}>
      <Text variant="titleMedium" style={styles.sectionTitle}>
        Pending User Verifications ({users.length})
      </Text>
      <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 12 }}>
        These users have registered and need your approval.
      </Text>
      {users.map((u: any) => (
        <Surface key={u.id} style={styles.card} elevation={1}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <Text variant="titleSmall">{u.firstName} {u.lastName}</Text>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                {u.email}
              </Text>
              <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
                <Chip compact>{u.role}</Chip>
                {u.department && <Chip compact icon="office-building">{u.department}</Chip>}
              </View>
            </View>
            <Button
              mode="contained"
              compact
              onPress={() => verifyUser({ variables: { userId: u.id } })}
            >
              Verify
            </Button>
          </View>
        </Surface>
      ))}
    </View>
  );
};

const AnalyticsGrid = ({ data, title = "Department Overview" }: { data: any, title?: string }) => {
  const theme = useTheme();
  if (!data) return null;

  return (
    <View>
      <Text variant="titleMedium" style={styles.sectionTitle}>{title}</Text>
      <View style={styles.grid}>
        <Surface style={styles.statBox} elevation={1}>
          <Text variant="headlineMedium" style={{ color: theme.colors.primary }}>{data.totalEvents}</Text>
          <Text variant="labelMedium">Total Events</Text>
        </Surface>
        <Surface style={styles.statBox} elevation={1}>
          <Text variant="headlineMedium" style={{ color: "#27AE60" }}>{data.approvedEvents}</Text>
          <Text variant="labelMedium">Approved</Text>
        </Surface>
        <Surface style={styles.statBox} elevation={1}>
          <Text variant="headlineMedium" style={{ color: "#E67E22" }}>{data.pendingEvents}</Text>
          <Text variant="labelMedium">Pending</Text>
        </Surface>
        <Surface style={styles.statBox} elevation={1}>
          <Text variant="headlineMedium" style={{ color: theme.colors.tertiary }}>{data.totalParticipants}</Text>
          <Text variant="labelMedium">Participants</Text>
        </Surface>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  content: { padding: 16 },
  header: { marginBottom: 24 },
  section: { marginBottom: 24 },
  sectionTitle: { fontWeight: "700", marginBottom: 12 },
  card: { padding: 16, borderRadius: 12, marginBottom: 12 },
  fab: { position: "absolute", margin: 16, right: 0, bottom: 80 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  statBox: { flex: 1, minWidth: "45%", padding: 16, borderRadius: 12, alignItems: "center" }
});