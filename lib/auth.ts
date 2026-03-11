import * as SecureStore from 'expo-secure-store';
import { api, setToken } from './api';

const TOKEN_KEY = 'em_jwt_token';
const USER_KEY = 'em_user';

export interface AuthUser {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  subRole: string;
  department?: string;
  institution?: string;
  rollOrEmpNo?: string;
  year?: string;
  phone?: string;
  avatarColor?: string;
  isVerified: boolean;
  collegeId?: number;
  collegeName?: string;
  token: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  collegeId?: number;
  department?: string;
  institution?: string;
  rollOrEmpNo?: string;
  year?: string;
  phone?: string;
}

/** Register a new user account. */
export async function register(data: RegisterData): Promise<AuthUser> {
  const response = await api.post<AuthUser>('/api/auth/register', data);
  await persistAuth(response);
  return response;
}

/** Log in with email and password. */
export async function login(email: string, password: string): Promise<AuthUser> {
  const response = await api.post<AuthUser>('/api/auth/login', { email, password });
  await persistAuth(response);
  return response;
}

/** Log out — clear stored token and user. */
export async function logout(): Promise<void> {
  setToken(null);
  await SecureStore.deleteItemAsync(TOKEN_KEY);
  await SecureStore.deleteItemAsync(USER_KEY);
}

/** Load the persisted auth session from SecureStore (call on app startup). */
export async function loadStoredAuth(): Promise<AuthUser | null> {
  try {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    const userJson = await SecureStore.getItemAsync(USER_KEY);
    if (!token || !userJson) return null;

    setToken(token);
    return JSON.parse(userJson) as AuthUser;
  } catch {
    return null;
  }
}

async function persistAuth(user: AuthUser): Promise<void> {
  setToken(user.token);
  await SecureStore.setItemAsync(TOKEN_KEY, user.token);
  await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
}
