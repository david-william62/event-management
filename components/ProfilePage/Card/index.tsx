import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar, Button, Chip, IconButton, Surface, Text } from 'react-native-paper';
import { useTheme } from 'react-native-paper';
import { ROLE_LABELS, ROLE_COLORS } from '@/lib/user-types';
import type { User } from '@/lib/user-types';

interface ProfileCardProps {
  user: User;
  onEditProfile?: () => void;
  onSettings?: () => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  user,
  onEditProfile,
  onSettings,
}) => {
  const theme = useTheme();
  const roleColor = ROLE_COLORS[user.primaryRole];

  return (
    <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]} elevation={2}>
      {/* Settings button top-right */}
      <View style={styles.topRow}>
        <View style={{ flex: 1 }} />
        <IconButton
          icon="cog-outline"
          iconColor={theme.colors.onSurfaceVariant}
          size={22}
          onPress={onSettings}
        />
      </View>

      {/* Avatar */}
      <View style={styles.avatarWrapper}>
        {user.avatarUri ? (
          <Avatar.Image size={96} source={{ uri: user.avatarUri }} />
        ) : (
          <Avatar.Text
            size={96}
            label={user.avatarInitials}
            style={{ backgroundColor: user.avatarColor }}
            labelStyle={{ color: '#ffffff', fontWeight: '700' }}
          />
        )}
        <IconButton
          icon="camera"
          size={16}
          iconColor="#ffffff"
          style={[styles.editAvatarBtn, { backgroundColor: theme.colors.primary }]}
          onPress={() => { }}
        />
      </View>

      {/* Name */}
      <Text
        variant="headlineMedium"
        style={[styles.name, { color: theme.colors.onSurface }]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {user.name}
      </Text>

      {/* Role chip */}
      <Chip
        style={[styles.roleChip, { backgroundColor: roleColor + '22' }]}
        textStyle={{ color: roleColor, fontWeight: '700', fontSize: 12 }}
        compact
      >
        {ROLE_LABELS[user.primaryRole]}
      </Chip>

      {/* Department & Institution */}
      <Text
        variant="bodyMedium"
        style={[styles.dept, { color: theme.colors.onSurfaceVariant }]}
      >
        {user.department}
      </Text>
      <Text
        variant="labelMedium"
        style={[styles.institution, { color: theme.colors.onSurfaceVariant }]}
        numberOfLines={1}
      >
        {user.institution}
      </Text>

      {/* ID */}
      <Text
        variant="labelSmall"
        style={[styles.rollNo, { color: theme.colors.outline }]}
      >
        {user.primaryRole === 'student' ? `Roll No: ${user.rollOrEmpNo}` : `Emp No: ${user.rollOrEmpNo}`}
        {user.year ? `  •  ${user.year}` : ''}
      </Text>

      {/* Action buttons */}
      <View style={styles.actions}>
        <Button
          mode="contained"
          onPress={onEditProfile}
          style={styles.editBtn}
          contentStyle={{ paddingHorizontal: 8 }}
          labelStyle={{ fontWeight: '600' }}
          icon="account-edit-outline"
        >
          Edit Profile
        </Button>
        <Button
          mode="outlined"
          onPress={() => { }}
          style={styles.shareBtn}
          contentStyle={{ paddingHorizontal: 8 }}
          icon="qrcode"
        >
          ID Card
        </Button>
      </View>

      {/* Contact row */}
      <View style={[styles.contactRow, { borderTopColor: theme.colors.outlineVariant }]}>
        <View style={styles.contactItem}>
          <IconButton icon="email-outline" size={16} iconColor={theme.colors.outline} style={{ margin: 0 }} />
          <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }} numberOfLines={1}>
            {user.email}
          </Text>
        </View>
        {user.phone && (
          <View style={styles.contactItem}>
            <IconButton icon="phone-outline" size={16} iconColor={theme.colors.outline} style={{ margin: 0 }} />
            <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
              {user.phone}
            </Text>
          </View>
        )}
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 16,
    marginHorizontal: 16,
    alignItems: 'center',
  },
  topRow: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    marginBottom: -8,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 12,
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    margin: 0,
    borderRadius: 12,
  },
  name: {
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 6,
  },
  roleChip: {
    marginBottom: 8,
    borderRadius: 20,
  },
  dept: {
    textAlign: 'center',
    fontWeight: '600',
  },
  institution: {
    textAlign: 'center',
    marginTop: 2,
  },
  rollNo: {
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 14,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  editBtn: {
    flex: 1,
    borderRadius: 12,
  },
  shareBtn: {
    flex: 1,
    borderRadius: 12,
  },
  contactRow: {
    alignSelf: 'stretch',
    borderTopWidth: 1,
    paddingTop: 8,
    gap: 2,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default ProfileCard;