import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, View, StyleSheet, Alert, RefreshControl } from 'react-native';
import {
  Text, useTheme, Surface, Button, TextInput, FAB,
  Portal, Modal, Divider, Chip, ActivityIndicator, IconButton,
} from 'react-native-paper';
import { useNavigation } from '@/lib/navigation-context';
import { api } from '@/lib/api';

// ─── Types ───────────────────────────────────────────────────────────────────

interface College {
  id: number;
  name: string;
  address?: string;
  city?: string;
  isActive: boolean;
  departmentCount?: number;
  organisationCount?: number;
  userCount?: number;
}

interface PendingUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  department?: string;
  collegeName?: string;
  isVerified: boolean;
}

// ─── Admin Panel ─────────────────────────────────────────────────────────────

export default function AdminPanel() {
  const theme = useTheme();
  const { authUser } = useNavigation();

  const [activeTab, setActiveTab] = useState<'colleges' | 'users' | 'approvals'>('colleges');
  const [refreshing, setRefreshing] = useState(false);

  // Colleges state
  const [colleges, setColleges] = useState<College[]>([]);
  const [loadingColleges, setLoadingColleges] = useState(true);

  // Create College modal
  const [showCollegeModal, setShowCollegeModal] = useState(false);
  const [collegeName, setCollegeName] = useState('');
  const [collegeAddress, setCollegeAddress] = useState('');
  const [collegeCity, setCollegeCity] = useState('');
  const [creatingCollege, setCreatingCollege] = useState(false);

  // Create Management User modal
  const [showMgmtModal, setShowMgmtModal] = useState(false);
  const [mgmtEmail, setMgmtEmail] = useState('');
  const [mgmtPassword, setMgmtPassword] = useState('');
  const [mgmtFirstName, setMgmtFirstName] = useState('');
  const [mgmtLastName, setMgmtLastName] = useState('');
  const [mgmtCollegeId, setMgmtCollegeId] = useState<number | null>(null);
  const [creatingMgmt, setCreatingMgmt] = useState(false);

  // Pending approvals
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [loadingPending, setLoadingPending] = useState(false);

  // Create Department modal
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [deptName, setDeptName] = useState('');
  const [deptDescription, setDeptDescription] = useState('');
  const [creatingDept, setCreatingDept] = useState(false);

  const isAdmin = authUser?.role === 'ADMIN';
  const isManagement = authUser?.role === 'MANAGEMENT';

  const fetchColleges = useCallback(async () => {
    try {
      const data = isAdmin
        ? await api.get<College[]>('/api/admin/colleges/all')
        : await api.get<College[]>('/api/admin/colleges');
      setColleges(data);
    } catch {
      // silent
    } finally {
      setLoadingColleges(false);
    }
  }, [isAdmin]);

  const fetchPendingApprovals = useCallback(async () => {
    setLoadingPending(true);
    try {
      const data = await api.get<PendingUser[]>('/api/admin/pending-approvals');
      setPendingUsers(data);
    } catch {
      // silent
    } finally {
      setLoadingPending(false);
    }
  }, []);

  useEffect(() => {
    fetchColleges();
    fetchPendingApprovals();
  }, [fetchColleges, fetchPendingApprovals]);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchColleges(), fetchPendingApprovals()]);
    setRefreshing(false);
  };

  const handleCreateCollege = async () => {
    if (!collegeName.trim()) {
      Alert.alert('Validation', 'College name is required.');
      return;
    }
    try {
      setCreatingCollege(true);
      await api.post('/api/admin/colleges', {
        name: collegeName.trim(),
        address: collegeAddress.trim() || null,
        city: collegeCity.trim() || null,
      });
      setShowCollegeModal(false);
      setCollegeName('');
      setCollegeAddress('');
      setCollegeCity('');
      fetchColleges();
      Alert.alert('Success', 'College created successfully.');
    } catch (err: any) {
      Alert.alert('Error', err.message ?? 'Failed to create college.');
    } finally {
      setCreatingCollege(false);
    }
  };

  const handleCreateManagementUser = async () => {
    if (!mgmtEmail || !mgmtPassword || !mgmtFirstName || !mgmtLastName || !mgmtCollegeId) {
      Alert.alert('Validation', 'All fields are required.');
      return;
    }
    try {
      setCreatingMgmt(true);
      await api.post('/api/admin/management-users', {
        email: mgmtEmail.trim().toLowerCase(),
        password: mgmtPassword,
        firstName: mgmtFirstName.trim(),
        lastName: mgmtLastName.trim(),
        collegeId: mgmtCollegeId,
        subRole: 'PRINCIPAL',
      });
      setShowMgmtModal(false);
      resetMgmtForm();
      Alert.alert('Success', 'Management user created successfully.');
    } catch (err: any) {
      Alert.alert('Error', err.message ?? 'Failed to create management user.');
    } finally {
      setCreatingMgmt(false);
    }
  };

  const handleCreateDepartment = async () => {
    if (!deptName.trim()) {
      Alert.alert('Validation', 'Department name is required.');
      return;
    }
    try {
      setCreatingDept(true);
      await api.post('/api/admin/departments', {
        name: deptName.trim(),
        description: deptDescription.trim() || null,
      });
      setShowDeptModal(false);
      setDeptName('');
      setDeptDescription('');
      fetchColleges();
      Alert.alert('Success', 'Department created successfully.');
    } catch (err: any) {
      Alert.alert('Error', err.message ?? 'Failed to create department.');
    } finally {
      setCreatingDept(false);
    }
  };

  const handleVerifyUser = async (userId: number) => {
    try {
      await api.post(`/api/admin/verify-user/${userId}`);
      fetchPendingApprovals();
      Alert.alert('Success', 'User verified successfully.');
    } catch (err: any) {
      // Fallback: try GraphQL
      Alert.alert('Error', err.message ?? 'Failed to verify user.');
    }
  };

  const resetMgmtForm = () => {
    setMgmtEmail('');
    setMgmtPassword('');
    setMgmtFirstName('');
    setMgmtLastName('');
    setMgmtCollegeId(null);
  };

  const inputTheme = { colors: { background: theme.colors.surface } };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text variant="headlineMedium" style={{ fontWeight: 'bold', color: theme.colors.onBackground }}>
            {isAdmin ? 'Admin Panel' : 'Management Panel'}
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
            {isAdmin ? 'Manage colleges, users, and approvals' : 'Manage departments and approvals'}
          </Text>
        </View>

        {/* Tab selector */}
        <View style={styles.tabRow}>
          {isAdmin && (
            <Button
              mode={activeTab === 'colleges' ? 'contained' : 'outlined'}
              compact
              onPress={() => setActiveTab('colleges')}
              style={styles.tabBtn}
            >
              Colleges
            </Button>
          )}
          {isAdmin && (
            <Button
              mode={activeTab === 'users' ? 'contained' : 'outlined'}
              compact
              onPress={() => setActiveTab('users')}
              style={styles.tabBtn}
            >
              Mgmt Users
            </Button>
          )}
          <Button
            mode={activeTab === 'approvals' ? 'contained' : 'outlined'}
            compact
            onPress={() => setActiveTab('approvals')}
            style={styles.tabBtn}
          >
            Approvals ({pendingUsers.length})
          </Button>
        </View>

        <Divider style={{ marginBottom: 16 }} />

        {/* Colleges Tab (Admin only) */}
        {activeTab === 'colleges' && isAdmin && (
          <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text variant="titleMedium" style={{ fontWeight: '700' }}>All Colleges</Text>
              <Button mode="contained-tonal" icon="plus" onPress={() => setShowCollegeModal(true)} compact>
                New College
              </Button>
            </View>

            {loadingColleges ? (
              <ActivityIndicator style={{ marginTop: 24 }} />
            ) : colleges.length === 0 ? (
              <Text style={{ textAlign: 'center', marginTop: 24, color: theme.colors.onSurfaceVariant }}>
                No colleges yet. Create one to get started.
              </Text>
            ) : (
              colleges.map((college) => (
                <Surface key={college.id} style={styles.card} elevation={1}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flex: 1 }}>
                      <Text variant="titleMedium" style={{ fontWeight: '600' }}>{college.name}</Text>
                      {college.city && (
                        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>{college.city}</Text>
                      )}
                    </View>
                    <Chip icon={college.isActive ? 'check-circle' : 'close-circle'} compact>
                      {college.isActive ? 'Active' : 'Inactive'}
                    </Chip>
                  </View>
                  <View style={{ flexDirection: 'row', gap: 16, marginTop: 8 }}>
                    <Text variant="labelSmall" style={{ color: theme.colors.primary }}>
                      {college.departmentCount ?? 0} depts
                    </Text>
                    <Text variant="labelSmall" style={{ color: theme.colors.tertiary }}>
                      {college.userCount ?? 0} users
                    </Text>
                    <Text variant="labelSmall" style={{ color: '#E67E22' }}>
                      {college.organisationCount ?? 0} orgs
                    </Text>
                  </View>
                </Surface>
              ))
            )}
          </View>
        )}

        {/* Management Users Tab (Admin only) */}
        {activeTab === 'users' && isAdmin && (
          <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text variant="titleMedium" style={{ fontWeight: '700' }}>Create Management User</Text>
            </View>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 16 }}>
              Create a Principal account for a college. They will manage departments, faculty, and HODs.
            </Text>

            <TextInput label="Email *" value={mgmtEmail} onChangeText={setMgmtEmail}
              keyboardType="email-address" autoCapitalize="none" mode="outlined"
              style={styles.input} theme={inputTheme} />

            <TextInput label="Password *" value={mgmtPassword} onChangeText={setMgmtPassword}
              secureTextEntry mode="outlined" style={styles.input} theme={inputTheme} />

            <View style={styles.row}>
              <TextInput label="First Name *" value={mgmtFirstName} onChangeText={setMgmtFirstName}
                mode="outlined" style={[styles.input, { flex: 1, marginRight: 8 }]} theme={inputTheme} />
              <TextInput label="Last Name *" value={mgmtLastName} onChangeText={setMgmtLastName}
                mode="outlined" style={[styles.input, { flex: 1 }]} theme={inputTheme} />
            </View>

            <Text variant="labelLarge" style={[styles.label, { color: theme.colors.onSurface }]}>
              Assign to College *
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
              {colleges.map((c) => (
                <Chip
                  key={c.id}
                  selected={mgmtCollegeId === c.id}
                  onPress={() => setMgmtCollegeId(c.id)}
                  showSelectedOverlay
                >
                  {c.name}
                </Chip>
              ))}
            </View>

            <Button
              mode="contained"
              onPress={handleCreateManagementUser}
              loading={creatingMgmt}
              disabled={creatingMgmt}
              style={{ marginTop: 8 }}
            >
              Create Principal Account
            </Button>
          </View>
        )}

        {/* Approvals Tab */}
        {activeTab === 'approvals' && (
          <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text variant="titleMedium" style={{ fontWeight: '700' }}>Pending Account Approvals</Text>
              <IconButton icon="refresh" onPress={fetchPendingApprovals} />
            </View>

            {loadingPending ? (
              <ActivityIndicator style={{ marginTop: 24 }} />
            ) : pendingUsers.length === 0 ? (
              <Surface style={[styles.card, { alignItems: 'center' }]} elevation={0}>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                  No pending approvals
                </Text>
              </Surface>
            ) : (
              pendingUsers.map((user) => (
                <Surface key={user.id} style={styles.card} elevation={1}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flex: 1 }}>
                      <Text variant="titleMedium">{user.firstName} {user.lastName}</Text>
                      <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                        {user.email}
                      </Text>
                      <View style={{ flexDirection: 'row', gap: 8, marginTop: 4 }}>
                        <Chip compact icon="account">{user.role}</Chip>
                        {user.department && <Chip compact icon="office-building">{user.department}</Chip>}
                      </View>
                      {user.collegeName && (
                        <Text variant="labelSmall" style={{ color: theme.colors.primary, marginTop: 4 }}>
                          {user.collegeName}
                        </Text>
                      )}
                    </View>
                    <Button
                      mode="contained"
                      compact
                      onPress={() => handleVerifyUser(user.id)}
                    >
                      Verify
                    </Button>
                  </View>
                </Surface>
              ))
            )}
          </View>
        )}

        {/* Department creation for Management users */}
        {isManagement && activeTab === 'colleges' && (
          <View style={{ marginTop: 24 }}>
            <Text variant="titleMedium" style={{ fontWeight: '700', marginBottom: 12 }}>Department Management</Text>
            <Button mode="contained-tonal" icon="plus" onPress={() => setShowDeptModal(true)}>
              Create Department
            </Button>
          </View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Create College Modal */}
      <Portal>
        <Modal
          visible={showCollegeModal}
          onDismiss={() => setShowCollegeModal(false)}
          contentContainerStyle={[styles.modal, { backgroundColor: theme.colors.surface }]}
        >
          <Text variant="titleLarge" style={{ fontWeight: '700', marginBottom: 16 }}>New College</Text>

          <TextInput label="College Name *" value={collegeName} onChangeText={setCollegeName}
            mode="outlined" style={styles.input} theme={inputTheme} />
          <TextInput label="Address" value={collegeAddress} onChangeText={setCollegeAddress}
            mode="outlined" style={styles.input} theme={inputTheme} />
          <TextInput label="City" value={collegeCity} onChangeText={setCollegeCity}
            mode="outlined" style={styles.input} theme={inputTheme} />

          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
            <Button mode="text" onPress={() => setShowCollegeModal(false)}>Cancel</Button>
            <Button mode="contained" onPress={handleCreateCollege} loading={creatingCollege}>Create</Button>
          </View>
        </Modal>
      </Portal>

      {/* Create Department Modal */}
      <Portal>
        <Modal
          visible={showDeptModal}
          onDismiss={() => setShowDeptModal(false)}
          contentContainerStyle={[styles.modal, { backgroundColor: theme.colors.surface }]}
        >
          <Text variant="titleLarge" style={{ fontWeight: '700', marginBottom: 16 }}>New Department</Text>

          <TextInput label="Department Name *" value={deptName} onChangeText={setDeptName}
            mode="outlined" style={styles.input} theme={inputTheme} />
          <TextInput label="Description" value={deptDescription} onChangeText={setDeptDescription}
            mode="outlined" style={styles.input} theme={inputTheme} multiline />

          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
            <Button mode="text" onPress={() => setShowDeptModal(false)}>Cancel</Button>
            <Button mode="contained" onPress={handleCreateDepartment} loading={creatingDept}>Create</Button>
          </View>
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16 },
  header: { marginBottom: 16 },
  tabRow: { flexDirection: 'row', gap: 8, marginBottom: 16, flexWrap: 'wrap' },
  tabBtn: { marginBottom: 4 },
  card: { padding: 16, borderRadius: 12, marginBottom: 12 },
  modal: { margin: 24, padding: 24, borderRadius: 16 },
  input: { marginBottom: 12 },
  row: { flexDirection: 'row', marginBottom: 4 },
  label: { marginBottom: 8, fontWeight: '600' },
});
