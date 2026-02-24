import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Chip, Icon, Surface, Text } from 'react-native-paper';
import { useTheme } from 'react-native-paper';
import type { OrgMembership } from '@/lib/user-types';

const ORG_TYPE_ICONS: Record<OrgMembership['orgType'], string> = {
  club: 'star-circle-outline',
  association: 'account-group-outline',
  committee: 'briefcase-outline',
  nss: 'hand-heart-outline',
  department: 'school-outline',
};

const ORG_TYPE_COLORS: Record<OrgMembership['orgType'], string> = {
  club: '#E67E22',
  association: '#4A90D9',
  committee: '#8E44AD',
  nss: '#27AE60',
  department: '#C0392B',
};

interface OrganisationCardProps {
  org: OrgMembership;
}

export const OrganisationCard: React.FC<OrganisationCardProps> = ({ org }) => {
  const theme = useTheme();
  const iconName = ORG_TYPE_ICONS[org.orgType];
  const accentColor = ORG_TYPE_COLORS[org.orgType];

  return (
    <Surface
      style={[styles.card, { backgroundColor: theme.colors.surface }]}
      elevation={1}
    >
      {/* Top accent bar */}
      <View style={[styles.accentBar, { backgroundColor: accentColor }]} />

      <View style={styles.body}>
        {/* Icon + org name */}
        <View style={styles.headerRow}>
          <View style={[styles.iconBg, { backgroundColor: accentColor + '22' }]}>
            <Icon source={iconName} size={22} color={accentColor} />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              variant="titleSmall"
              numberOfLines={2}
              style={[styles.orgName, { color: theme.colors.onSurface }]}
            >
              {org.orgName}
            </Text>
            <Text
              variant="labelSmall"
              style={{ color: theme.colors.onSurfaceVariant, textTransform: 'capitalize' }}
            >
              {org.orgType} • Since {org.joinedYear}
            </Text>
          </View>
        </View>

        {/* Position chip */}
        <Chip
          style={[styles.positionChip, { backgroundColor: accentColor + '18' }]}
          textStyle={{ color: accentColor, fontWeight: '600', fontSize: 11 }}
          compact
          icon={() => <Icon source="medal-outline" size={13} color={accentColor} />}
        >
          {org.position}
        </Chip>

        {/* Members count + status */}
        <View style={styles.footer}>
          <View style={styles.metaItem}>
            <Icon source="account-multiple-outline" size={14} color={theme.colors.outline} />
            <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, marginLeft: 4 }}>
              {org.memberCount} members
            </Text>
          </View>
          <View style={[styles.statusDot, { backgroundColor: org.isActive ? '#27AE60' : '#999' }]} />
          <Text variant="labelSmall" style={{ color: org.isActive ? '#27AE60' : '#999', fontWeight: '600' }}>
            {org.isActive ? 'Active' : 'Inactive'}
          </Text>
        </View>
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 12,
  },
  accentBar: {
    height: 4,
  },
  body: {
    padding: 14,
    gap: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  iconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orgName: {
    fontWeight: '700',
    lineHeight: 18,
    marginBottom: 2,
  },
  positionChip: {
    alignSelf: 'flex-start',
    borderRadius: 20,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
});

export default OrganisationCard;
