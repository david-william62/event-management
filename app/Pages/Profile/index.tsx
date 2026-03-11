import React from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Button, Icon, Surface, Text, useTheme } from 'react-native-paper';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

import { ProfileCard } from '@/components/ProfilePage/Card';
import { OrganisationCard } from '@/components/ProfilePage/OrganisationCard';
import { ManagementTab } from '@/components/ProfilePage/ManagementTab';
import { type UserRole } from '@/lib/user-types';
import { useNavigation } from '@/lib/navigation-context';
import { logout } from '@/lib/auth';
import { apolloClient } from '@/lib/apollo';

const PROFILE_QUERY = gql`
  query GetProfile {
    me {
      id
      email
      firstName
      lastName
      phone
      role
      subRole
      department
      institution
      rollOrEmpNo
      year
      avatarColor
      isVerified
      collegeId
      collegeName
      eventsOrganised
      eventsAttended
      eventsUpcoming
      orgMemberships {
        id
        position
        joinedYear
        isActive
        organisation {
          id
          name
          orgType
        }
      }
      managedMembers {
        id
        email
        firstName
        lastName
        role
        subRole
        department
        rollOrEmpNo
        year
        avatarColor
      }
    }
  }
`;

// Roles that have a management view
const MANAGEMENT_ROLES = new Set(['HOD', 'MANAGEMENT', 'ADMIN']);

interface StatTileProps {
  icon: string;
  label: string;
  value: number;
  color: string;
}

const StatTile: React.FC<StatTileProps> = ({ icon, label, value, color }) => {
  const theme = useTheme();
  return (
    <Surface style={[styles.statTile, { backgroundColor: color + '18' }]} elevation={0}>
      <Icon source={icon} size={24} color={color} />
      <Text variant="headlineSmall" style={[styles.statValue, { color }]}>{value}</Text>
      <Text variant="labelSmall" style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]} numberOfLines={1}>
        {label}
      </Text>
    </Surface>
  );
};

export default function ProfileScreen() {
  const theme = useTheme();
  const { setAuthUser } = useNavigation();

  const handleLogout = async () => {
    await logout();
    await apolloClient.clearStore();
    setAuthUser(null);
  };

  const { data, loading, error } = useQuery(PROFILE_QUERY, {
    fetchPolicy: 'cache-and-network',
  });

  if (loading && !data) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator animating size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (error || !data?.me) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: theme.colors.background }}>
        <Text variant="bodyLarge" style={{ color: theme.colors.error, textAlign: 'center' }}>
          Failed to load profile. {error?.message}
        </Text>
      </View>
    );
  }

  const user = data.me;
  const showManagement = MANAGEMENT_ROLES.has(user.role) || user.role === 'FACULTY';

  // Adapt Apollo response to the shape ProfileCard/ManagementTab expects
  const adaptedUser = {
    id: String(user.id),
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
    phone: user.phone,
    avatarInitials: `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase(),
    avatarColor: user.avatarColor ?? '#4A90D9',
    primaryRole: user.role?.toLowerCase() ?? 'student',
    department: user.department ?? '',
    institution: user.institution ?? '',
    rollOrEmpNo: user.rollOrEmpNo ?? '',
    year: user.year,
    eventsAttended: user.eventsAttended ?? 0,
    eventsOrganised: user.eventsOrganised ?? 0,
    eventsUpcoming: user.eventsUpcoming ?? 0,
    organisations: (user.orgMemberships ?? []).map((m: any) => ({
      id: String(m.id),
      orgName: m.organisation.name,
      orgType: m.organisation.orgType?.toLowerCase() ?? 'club',
      position: m.position,
      joinedYear: m.joinedYear,
      isActive: m.isActive,
      memberCount: 0,
    })),
    managedMembers: (user.managedMembers ?? []).map((m: any) => ({
      id: String(m.id),
      name: `${m.firstName} ${m.lastName}`,
      rollOrEmpNo: m.rollOrEmpNo ?? '',
      avatarInitials: `${m.firstName?.[0] ?? ''}${m.lastName?.[0] ?? ''}`.toUpperCase(),
      avatarColor: m.avatarColor ?? '#4A90D9',
      memberRole: m.role?.toLowerCase() ?? 'student',
      subRole: m.subRole?.toLowerCase() ?? 'none',
      department: m.department ?? '',
      year: m.year,
      joinedDate: '',
    })),
  };

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={[styles.headerBg, { backgroundColor: theme.colors.primaryContainer }]}>
        <Text variant="labelLarge" style={[styles.screenTitle, { color: theme.colors.onPrimaryContainer }]}>
          My Profile
        </Text>
      </View>

      {/* Profile card */}
      <View style={styles.cardOverlap}>
        <ProfileCard user={adaptedUser} onEditProfile={() => { }} onSettings={() => { }} />
      </View>

      {/* Stats */}
      <View style={styles.section}>
        <View style={styles.statsRow}>
          <StatTile icon="calendar-check-outline" label="Attended" value={adaptedUser.eventsAttended} color="#4A90D9" />
          <StatTile icon="pencil-ruler" label="Organised" value={adaptedUser.eventsOrganised} color="#E67E22" />
          <StatTile icon="calendar-clock-outline" label="Upcoming" value={adaptedUser.eventsUpcoming} color="#27AE60" />
        </View>
      </View>

      {/* Organisations */}
      {adaptedUser.organisations.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon source="account-group-outline" size={18} color={theme.colors.primary} />
            <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Organisations &amp; Positions
            </Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.orgScroll}>
            {adaptedUser.organisations.map((org: any) => (
              <OrganisationCard key={org.id} org={org} />
            ))}
          </ScrollView>
        </View>
      )}

      {/* Management */}
      {showManagement && adaptedUser.managedMembers.length > 0 && (
        <View style={[styles.section, styles.managementSection]}>
          <Surface style={[styles.managementCard, { backgroundColor: theme.colors.surface }]} elevation={1}>
            <ManagementTab members={adaptedUser.managedMembers} managerRole={adaptedUser.primaryRole as UserRole} />
          </Surface>
        </View>
      )}

      {/* Logout */}
      <View style={styles.section}>
        <Button
          mode="outlined"
          icon="logout"
          onPress={handleLogout}
          textColor={theme.colors.error}
          style={[styles.logoutBtn, { borderColor: theme.colors.error }]}
        >
          Log Out
        </Button>
      </View>

      <View style={{ height: 120 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingBottom: 0 },
  headerBg: { height: 120, paddingTop: 52, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center' },
  screenTitle: { fontWeight: '700', letterSpacing: 0.5 },
  cardOverlap: { marginTop: -48, zIndex: 10 },
  section: { paddingHorizontal: 16, marginTop: 20 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  sectionTitle: { fontWeight: '700' },
  statsRow: { flexDirection: 'row', gap: 10 },
  statTile: { flex: 1, alignItems: 'center', borderRadius: 16, paddingVertical: 14, paddingHorizontal: 8, gap: 4 },
  statValue: { fontWeight: '800' },
  statLabel: { textAlign: 'center' },
  orgScroll: { paddingRight: 16 },
  managementSection: { marginTop: 24 },
  managementCard: { borderRadius: 20, padding: 16 },
  logoutBtn: { borderRadius: 12, marginTop: 8 },
});
