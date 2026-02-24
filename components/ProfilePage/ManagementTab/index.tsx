import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import {
  Avatar,
  Chip,
  Divider,
  Icon,
  IconButton,
  Menu,
  Searchbar,
  SegmentedButtons,
  Surface,
  Text,
} from 'react-native-paper';
import { useTheme } from 'react-native-paper';
import {
  ROLE_LABELS,
  ROLE_COLORS,
  SUB_ROLE_LABELS,
  type ManagedMember,
  type SubRole,
  type UserRole,
} from '@/lib/user-types';

// Which segment options to show per managing role
const SEGMENT_OPTIONS: Partial<Record<UserRole, { value: string; label: string }[]>> = {
  hod: [
    { value: 'faculty', label: 'Faculty' },
    { value: 'students', label: 'Students' },
  ],
  vice_principal: [
    { value: 'faculty', label: 'Faculty' },
    { value: 'students', label: 'Students' },
  ],
  admin: [
    { value: 'faculty', label: 'Faculty' },
    { value: 'students', label: 'Students' },
  ],
  org_advisor: [
    { value: 'students', label: 'Members' },
  ],
};

// Sub-roles available to assign for students vs faculty
const STUDENT_SUB_ROLES: SubRole[] = [
  'none', 'class_representative', 'student_coordinator', 'event_organiser', 'lab_assistant',
];
const FACULTY_SUB_ROLES: SubRole[] = [
  'none', 'class_advisor', 'department_coordinator', 'mentor', 'event_organiser',
];

interface ManagementTabProps {
  members: ManagedMember[];
  managerRole: UserRole;
}

export const ManagementTab: React.FC<ManagementTabProps> = ({ members, managerRole }) => {
  const theme = useTheme();
  const segments = SEGMENT_OPTIONS[managerRole] ?? [{ value: 'students', label: 'Members' }];
  const [activeSegment, setActiveSegment] = useState(segments[0].value);
  const [searchQuery, setSearchQuery] = useState('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [memberSubRoles, setMemberSubRoles] = useState<Record<string, SubRole>>(
    Object.fromEntries(members.map((m) => [m.id, m.subRole]))
  );

  const isFacultySegment = activeSegment === 'faculty';

  const filtered = members
    .filter((m) => isFacultySegment
      ? (m.memberRole === 'staff' || m.memberRole === 'org_advisor' || m.memberRole === 'hod')
      : (m.memberRole === 'student'),
    )
    .filter((m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.rollOrEmpNo.toLowerCase().includes(searchQuery.toLowerCase()),
    );

  const availableSubRoles = isFacultySegment ? FACULTY_SUB_ROLES : STUDENT_SUB_ROLES;

  const handleAssignRole = (memberId: string, role: SubRole) => {
    setMemberSubRoles((prev) => ({ ...prev, [memberId]: role }));
    setOpenMenuId(null);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Icon source="account-supervisor-outline" size={20} color={theme.colors.primary} />
        <Text variant="titleMedium" style={[styles.title, { color: theme.colors.onSurface }]}>
          Manage Members
        </Text>
        <Surface style={[styles.countBadge, { backgroundColor: theme.colors.primaryContainer }]} elevation={0}>
          <Text variant="labelSmall" style={{ color: theme.colors.primary, fontWeight: '700' }}>
            {filtered.length}
          </Text>
        </Surface>
      </View>

      {/* Segment filter (only show if there are multiple segments) */}
      {segments.length > 1 && (
        <SegmentedButtons
          value={activeSegment}
          onValueChange={setActiveSegment}
          buttons={segments}
          style={styles.segments}
        />
      )}

      {/* Search */}
      <Searchbar
        placeholder={`Search ${isFacultySegment ? 'faculty' : 'members'}…`}
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={[styles.searchbar, { backgroundColor: theme.colors.surfaceVariant }]}
        inputStyle={{ fontSize: 14 }}
        elevation={0}
        iconColor={theme.colors.outline}
      />

      {/* Member list */}
      <ScrollView
        style={styles.list}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
      >
        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon source="account-search-outline" size={40} color={theme.colors.outline} />
            <Text variant="bodyMedium" style={{ color: theme.colors.outline, marginTop: 8 }}>
              No members found
            </Text>
          </View>
        ) : (
          filtered.map((member, idx) => {
            const currentSubRole = memberSubRoles[member.id] ?? member.subRole;
            const roleColor = ROLE_COLORS[member.memberRole];
            return (
              <View key={member.id}>
                <View style={styles.memberRow}>
                  {/* Avatar */}
                  <Avatar.Text
                    size={44}
                    label={member.avatarInitials}
                    style={{ backgroundColor: member.avatarColor }}
                    labelStyle={{ color: '#fff', fontWeight: '700', fontSize: 14 }}
                  />

                  {/* Info */}
                  <View style={styles.memberInfo}>
                    <Text
                      variant="titleSmall"
                      style={[styles.memberName, { color: theme.colors.onSurface }]}
                    >
                      {member.name}
                    </Text>
                    <View style={styles.memberMeta}>
                      <Chip
                        compact
                        style={[styles.roleBadge, { backgroundColor: roleColor + '1A' }]}
                        textStyle={{ color: roleColor, fontSize: 10, fontWeight: '600' }}
                      >
                        {ROLE_LABELS[member.memberRole]}
                      </Chip>
                      <Text variant="labelSmall" style={{ color: theme.colors.outline }}>
                        {member.rollOrEmpNo}
                      </Text>
                      {member.year && (
                        <Text variant="labelSmall" style={{ color: theme.colors.outline }}>
                          {member.year}
                        </Text>
                      )}
                    </View>

                    {/* Current sub-role */}
                    {currentSubRole !== 'none' && (
                      <View style={styles.subRoleRow}>
                        <Icon source="badge-account-horizontal-outline" size={12} color={theme.colors.primary} />
                        <Text
                          variant="labelSmall"
                          style={{ color: theme.colors.primary, marginLeft: 4, fontWeight: '600' }}
                        >
                          {SUB_ROLE_LABELS[currentSubRole]}
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Assign role button + menu */}
                  <Menu
                    visible={openMenuId === member.id}
                    onDismiss={() => setOpenMenuId(null)}
                    anchor={
                      <IconButton
                        icon="account-cog-outline"
                        size={20}
                        iconColor={theme.colors.primary}
                        onPress={() => setOpenMenuId(member.id)}
                        style={styles.assignBtn}
                      />
                    }
                    contentStyle={{ borderRadius: 16 }}
                  >
                    <Text
                      variant="labelSmall"
                      style={[styles.menuHeader, { color: theme.colors.outline }]}
                    >
                      ASSIGN ROLE
                    </Text>
                    {availableSubRoles.map((sr) => (
                      <Menu.Item
                        key={sr}
                        title={SUB_ROLE_LABELS[sr]}
                        leadingIcon={currentSubRole === sr ? 'check' : 'circle-small'}
                        titleStyle={{
                          fontWeight: currentSubRole === sr ? '700' : '400',
                          color: currentSubRole === sr ? theme.colors.primary : theme.colors.onSurface,
                          fontSize: 14,
                        }}
                        onPress={() => handleAssignRole(member.id, sr)}
                      />
                    ))}
                  </Menu>
                </View>
                {idx < filtered.length - 1 && (
                  <Divider style={{ marginHorizontal: 56, opacity: 0.5 }} />
                )}
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  title: {
    fontWeight: '700',
    flex: 1,
  },
  countBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  segments: {
    marginBottom: 12,
  },
  searchbar: {
    borderRadius: 14,
    marginBottom: 12,
    height: 44,
  },
  list: {
    maxHeight: 440,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 12,
  },
  memberInfo: {
    flex: 1,
    gap: 3,
  },
  memberName: {
    fontWeight: '600',
  },
  memberMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  roleBadge: {
    borderRadius: 20,
    height: 22,
  },
  subRoleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 1,
  },
  assignBtn: {
    margin: 0,
  },
  menuHeader: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
    letterSpacing: 0.5,
  },
});

export default ManagementTab;
