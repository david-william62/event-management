import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Icon, Surface, Text } from 'react-native-paper';
import { useTheme } from 'react-native-paper';

import { ProfileCard } from '@/components/ProfilePage/Card';
import { OrganisationCard } from '@/components/ProfilePage/OrganisationCard';
import { ManagementTab } from '@/components/ProfilePage/ManagementTab';
import { MOCK_USER } from '@/lib/mock-data';

// Roles that have a management view
const MANAGEMENT_ROLES = new Set(['hod', 'org_advisor', 'vice_principal', 'admin']);

// ─── Stat tile ───────────────────────────────────────────────────────────────
interface StatTileProps {
  icon: string;
  label: string;
  value: number;
  color: string;
}

const StatTile: React.FC<StatTileProps> = ({ icon, label, value, color }) => {
  const theme = useTheme();
  return (
    <Surface
      style={[styles.statTile, { backgroundColor: color + '18' }]}
      elevation={0}
    >
      <Icon source={icon} size={24} color={color} />
      <Text variant="headlineSmall" style={[styles.statValue, { color }]}>
        {value}
      </Text>
      <Text
        variant="labelSmall"
        style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </Surface>
  );
};

// ─── Main Screen ─────────────────────────────────────────────────────────────
export default function ProfileScreen() {
  const theme = useTheme();
  const user = MOCK_USER;
  const showManagement = MANAGEMENT_ROLES.has(user.primaryRole);

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <View style={[styles.headerBg, { backgroundColor: theme.colors.primaryContainer }]}>
        <Text
          variant="labelLarge"
          style={[styles.screenTitle, { color: theme.colors.onPrimaryContainer }]}
        >
          My Profile
        </Text>
      </View>

      {/* ── Profile card (overlaps the header) ─────────────────────────── */}
      <View style={styles.cardOverlap}>
        <ProfileCard
          user={user}
          onEditProfile={() => { }}
          onSettings={() => { }}
        />
      </View>

      {/* ── Stats row ──────────────────────────────────────────────────── */}
      <View style={styles.section}>
        <View style={styles.statsRow}>
          <StatTile
            icon="calendar-check-outline"
            label="Attended"
            value={user.eventsAttended}
            color="#4A90D9"
          />
          <StatTile
            icon="pencil-ruler"
            label="Organised"
            value={user.eventsOrganised}
            color="#E67E22"
          />
          <StatTile
            icon="calendar-clock-outline"
            label="Upcoming"
            value={user.eventsUpcoming}
            color="#27AE60"
          />
        </View>
      </View>

      {/* ── Organisations ──────────────────────────────────────────────── */}
      {user.organisations.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon source="account-group-outline" size={18} color={theme.colors.primary} />
            <Text
              variant="titleMedium"
              style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
            >
              Organisations & Positions
            </Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.orgScroll}
          >
            {user.organisations.map((org) => (
              <OrganisationCard key={org.id} org={org} />
            ))}
          </ScrollView>
        </View>
      )}

      {/* ── Management section (role-gated) ────────────────────────────── */}
      {showManagement && user.managedMembers.length > 0 && (
        <View style={[styles.section, styles.managementSection]}>
          <Surface
            style={[styles.managementCard, { backgroundColor: theme.colors.surface }]}
            elevation={1}
          >
            <ManagementTab
              members={user.managedMembers}
              managerRole={user.primaryRole}
            />
          </Surface>
        </View>
      )}

      <View style={{ height: 120 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingBottom: 0,
  },
  headerBg: {
    height: 120,
    paddingTop: 52,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  screenTitle: {
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  cardOverlap: {
    marginTop: -48,
    zIndex: 10,
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statTile: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 8,
    gap: 4,
  },
  statValue: {
    fontWeight: '800',
  },
  statLabel: {
    textAlign: 'center',
  },
  orgScroll: {
    paddingRight: 16,
  },
  managementSection: {
    marginTop: 24,
  },
  managementCard: {
    borderRadius: 20,
    padding: 16,
  },
});
