import { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, useTheme, Menu, Divider, ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@/lib/navigation-context';
import { register } from '@/lib/auth';
import { api } from '@/lib/api';

const ROLES = [
  { value: 'STUDENT', label: 'Student' },
  { value: 'FACULTY', label: 'Faculty' },
  { value: 'HOD', label: 'Head of Department' },
];

interface CollegeOption {
  id: number;
  name: string;
  city?: string;
}

interface DepartmentOption {
  id: number;
  name: string;
}

export default function RegisterScreen() {
  const theme = useTheme();
  const { setCurrentRoute, setAuthUser } = useNavigation();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('STUDENT');
  const [rollOrEmpNo, setRollOrEmpNo] = useState('');
  const [year, setYear] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  // College & Department state
  const [colleges, setColleges] = useState<CollegeOption[]>([]);
  const [selectedCollege, setSelectedCollege] = useState<CollegeOption | null>(null);
  const [collegeMenuVisible, setCollegeMenuVisible] = useState(false);

  const [departments, setDepartments] = useState<DepartmentOption[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentOption | null>(null);
  const [deptMenuVisible, setDeptMenuVisible] = useState(false);

  const [loadingColleges, setLoadingColleges] = useState(true);
  const [loadingDepartments, setLoadingDepartments] = useState(false);

  // Fetch colleges on mount
  useEffect(() => {
    api.get<CollegeOption[]>('/api/admin/colleges')
      .then(setColleges)
      .catch(() => Alert.alert('Error', 'Could not load colleges.'))
      .finally(() => setLoadingColleges(false));
  }, []);

  // Fetch departments when a college is selected
  useEffect(() => {
    if (!selectedCollege) {
      setDepartments([]);
      setSelectedDepartment(null);
      return;
    }
    setLoadingDepartments(true);
    setSelectedDepartment(null);
    api.get<DepartmentOption[]>(`/api/admin/colleges/${selectedCollege.id}/departments`)
      .then(setDepartments)
      .catch(() => setDepartments([]))
      .finally(() => setLoadingDepartments(false));
  }, [selectedCollege]);

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !password) {
      Alert.alert('Validation', 'Please fill in all required fields.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Validation', 'Password must be at least 6 characters.');
      return;
    }
    if (!selectedCollege) {
      Alert.alert('Validation', 'Please select a college.');
      return;
    }

    try {
      setLoading(true);
      const user = await register({
        firstName,
        lastName,
        email: email.trim().toLowerCase(),
        password,
        role,
        collegeId: selectedCollege.id,
        department: selectedDepartment?.name || undefined,
        institution: selectedCollege.name,
        rollOrEmpNo: rollOrEmpNo || undefined,
        year: year || undefined,
        phone: phone || undefined,
      });
      setAuthUser(user);
      Alert.alert(
        'Account Created',
        'Your account is pending verification by your institution. You can browse events while waiting.',
        [{ text: 'OK', onPress: () => setCurrentRoute('home') }]
      );
    } catch (err: any) {
      Alert.alert('Registration Failed', err.message ?? 'Could not create account.');
    } finally {
      setLoading(false);
    }
  };

  const inputTheme = { colors: { background: theme.colors.surface } };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.primary }]}>
          Create Account
        </Text>

        {/* Name row */}
        <View style={styles.row}>
          <TextInput label="First Name *" value={firstName} onChangeText={setFirstName}
            mode="outlined" style={[styles.input, { flex: 1, marginRight: 8 }]} theme={inputTheme} />
          <TextInput label="Last Name *" value={lastName} onChangeText={setLastName}
            mode="outlined" style={[styles.input, { flex: 1 }]} theme={inputTheme} />
        </View>

        <TextInput label="Email *" value={email} onChangeText={setEmail}
          keyboardType="email-address" autoCapitalize="none" mode="outlined"
          style={styles.input} theme={inputTheme}
          left={<TextInput.Icon icon="email-outline" />} />

        <TextInput label="Password * (min 6 chars)" value={password} onChangeText={setPassword}
          secureTextEntry={!showPassword} mode="outlined" style={styles.input} theme={inputTheme}
          left={<TextInput.Icon icon="lock-outline" />}
          right={<TextInput.Icon icon={showPassword ? 'eye-off' : 'eye'} onPress={() => setShowPassword(!showPassword)} />} />

        {/* Role selector */}
        <Text variant="labelLarge" style={[styles.label, { color: theme.colors.onSurface }]}>
          Role *
        </Text>
        <View style={styles.roleRow}>
          {ROLES.map((r) => (
            <Button key={r.value} mode={role === r.value ? 'contained' : 'outlined'}
              compact style={styles.roleChip} onPress={() => setRole(r.value)}>
              {r.label}
            </Button>
          ))}
        </View>

        {/* College dropdown */}
        <Text variant="labelLarge" style={[styles.label, { color: theme.colors.onSurface }]}>
          College *
        </Text>
        {loadingColleges ? (
          <ActivityIndicator style={{ marginBottom: 12 }} />
        ) : (
          <Menu
            visible={collegeMenuVisible}
            onDismiss={() => setCollegeMenuVisible(false)}
            anchor={
              <Button
                mode="outlined"
                onPress={() => setCollegeMenuVisible(true)}
                icon="school"
                contentStyle={{ justifyContent: 'flex-start' }}
                style={[styles.dropdownBtn, { borderColor: theme.colors.outline }]}
              >
                {selectedCollege?.name ?? 'Select College'}
              </Button>
            }
            contentStyle={{ backgroundColor: theme.colors.surface }}
          >
            {colleges.map((c) => (
              <Menu.Item
                key={c.id}
                onPress={() => {
                  setSelectedCollege(c);
                  setCollegeMenuVisible(false);
                }}
                title={c.name}
                description={c.city || undefined}
              />
            ))}
            {colleges.length === 0 && (
              <Menu.Item title="No colleges available" disabled />
            )}
          </Menu>
        )}

        {/* Department dropdown (only if college is selected) */}
        {selectedCollege && (
          <>
            <Text variant="labelLarge" style={[styles.label, { color: theme.colors.onSurface }]}>
              Department
            </Text>
            {loadingDepartments ? (
              <ActivityIndicator style={{ marginBottom: 12 }} />
            ) : departments.length > 0 ? (
              <Menu
                visible={deptMenuVisible}
                onDismiss={() => setDeptMenuVisible(false)}
                anchor={
                  <Button
                    mode="outlined"
                    onPress={() => setDeptMenuVisible(true)}
                    icon="office-building"
                    contentStyle={{ justifyContent: 'flex-start' }}
                    style={[styles.dropdownBtn, { borderColor: theme.colors.outline }]}
                  >
                    {selectedDepartment?.name ?? 'Select Department'}
                  </Button>
                }
                contentStyle={{ backgroundColor: theme.colors.surface }}
              >
                {departments.map((d) => (
                  <Menu.Item
                    key={d.id}
                    onPress={() => {
                      setSelectedDepartment(d);
                      setDeptMenuVisible(false);
                    }}
                    title={d.name}
                  />
                ))}
              </Menu>
            ) : (
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 12 }}>
                No departments configured for this college yet.
              </Text>
            )}
          </>
        )}

        {/* Role-specific fields */}
        {role === 'STUDENT' && (
          <>
            <TextInput label="Roll Number" value={rollOrEmpNo} onChangeText={setRollOrEmpNo}
              mode="outlined" style={styles.input} theme={inputTheme} />
            <TextInput label="Year (e.g. 2nd Year)" value={year} onChangeText={setYear}
              mode="outlined" style={styles.input} theme={inputTheme} />
          </>
        )}

        {(role === 'FACULTY' || role === 'HOD') && (
          <TextInput label="Employee ID" value={rollOrEmpNo} onChangeText={setRollOrEmpNo}
            mode="outlined" style={styles.input} theme={inputTheme} />
        )}

        <TextInput label="Phone" value={phone} onChangeText={setPhone}
          keyboardType="phone-pad" mode="outlined" style={styles.input} theme={inputTheme} />

        <Button mode="contained" onPress={handleRegister} loading={loading} disabled={loading}
          style={styles.btn} contentStyle={{ paddingVertical: 6 }}>
          Create Account
        </Button>

        <Button mode="text" onPress={() => setCurrentRoute('login')} style={{ marginTop: 8 }}
          textColor={theme.colors.primary}>
          Already have an account? Sign In
        </Button>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, paddingTop: 48 },
  title: { fontWeight: '800', marginBottom: 24, textAlign: 'center' },
  row: { flexDirection: 'row', marginBottom: 4 },
  input: { marginBottom: 12 },
  label: { marginBottom: 8, fontWeight: '600' },
  roleRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  roleChip: { marginBottom: 4 },
  dropdownBtn: { marginBottom: 16, justifyContent: 'flex-start' },
  btn: { marginTop: 8, borderRadius: 8 },
});
