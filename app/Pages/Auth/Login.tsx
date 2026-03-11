import { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, useTheme } from 'react-native-paper';
import { useNavigation } from '@/lib/navigation-context';
import { login } from '@/lib/auth';

export default function LoginScreen() {
  const theme = useTheme();
  const { setCurrentRoute, setAuthUser } = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Validation', 'Please enter email and password.');
      return;
    }

    try {
      setLoading(true);
      const user = await login(email.trim().toLowerCase(), password);
      setAuthUser(user);
      setCurrentRoute('home');
    } catch (err: any) {
      Alert.alert('Login Failed', err.message ?? 'Invalid email or password.');
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
        <View style={styles.header}>
          <Text variant="displaySmall" style={[styles.title, { color: theme.colors.primary }]}>
            Event Manager
          </Text>
          <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}>
            Sign in to continue
          </Text>
        </View>

        <View style={styles.form}>
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            mode="outlined"
            style={styles.input}
            theme={inputTheme}
            left={<TextInput.Icon icon="email-outline" />}
          />

          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            mode="outlined"
            style={styles.input}
            theme={inputTheme}
            left={<TextInput.Icon icon="lock-outline" />}
            right={
              <TextInput.Icon
                icon={showPassword ? 'eye-off' : 'eye'}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
          />

          <Button
            mode="contained"
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
            style={styles.btn}
            contentStyle={{ paddingVertical: 6 }}
          >
            Sign In
          </Button>

          <Button
            mode="text"
            onPress={() => setCurrentRoute('register')}
            style={{ marginTop: 8 }}
            textColor={theme.colors.primary}
          >
            Don't have an account? Register
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', padding: 28 },
  header: { alignItems: 'center', marginBottom: 40 },
  title: { fontWeight: '800', letterSpacing: -0.5 },
  form: { gap: 4 },
  input: { marginBottom: 12 },
  btn: { marginTop: 8, borderRadius: 8 },
});
