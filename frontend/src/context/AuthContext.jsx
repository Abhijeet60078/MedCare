import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AUTH_STORAGE_KEY = 'medcare-auth-session';
const USERS_STORAGE_KEY = 'medcare-auth-users';

const DEFAULT_USERS = [
  {
    name: 'Admin User',
    email: 'admin@medcare.com',
    password: 'Admin@123',
    role: 'admin',
  },
  {
    name: 'Doctor User',
    email: 'doctor@medcare.com',
    password: 'Doctor@123',
    role: 'doctor',
  },
  {
    name: 'Patient User',
    email: 'patient@medcare.com',
    password: 'Patient@123',
    role: 'patient',
  },
];

export const AuthContext = createContext(null);

function normalizeRole(role) {
  return ['admin', 'doctor', 'patient'].includes(String(role).toLowerCase()) ? String(role).toLowerCase() : '';
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function readJson(storageKey, fallbackValue) {
  if (typeof window === 'undefined') return fallbackValue;

  try {
    const storedValue = window.localStorage.getItem(storageKey);
    return storedValue ? JSON.parse(storedValue) : fallbackValue;
  } catch {
    return fallbackValue;
  }
}

function writeJson(storageKey, value) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(storageKey, JSON.stringify(value));
}

function createDemoUsers() {
  return DEFAULT_USERS.map((user) => ({ ...user }));
}

function loadUsers() {
  const savedUsers = readJson(USERS_STORAGE_KEY, []);
  const mergedUsers = createDemoUsers();

  savedUsers.forEach((user) => {
    if (!user) return;

    const email = normalizeEmail(user.email);
    const role = normalizeRole(user.role);
    if (!email || !role) return;

    const exists = mergedUsers.some((item) => item.email === email && item.role === role);
    if (!exists) {
      mergedUsers.push({
        name: String(user.name || '').trim() || `${role[0].toUpperCase()}${role.slice(1)} User`,
        email,
        password: String(user.password || ''),
        role,
      });
    }
  });

  writeJson(USERS_STORAGE_KEY, mergedUsers);
  return mergedUsers;
}

function loadSession() {
  const storedSession = readJson(AUTH_STORAGE_KEY, null);
  if (!storedSession) return null;

  const email = normalizeEmail(storedSession.email);
  const role = normalizeRole(storedSession.role);
  if (!email || !role) return null;

  return {
    name: String(storedSession.name || '').trim(),
    email,
    role,
  };
}

export function AuthProvider({ children }) {
  const [authUser, setAuthUser] = useState(() => loadSession());
  const [registeredUsers, setRegisteredUsers] = useState(() => loadUsers());

  useEffect(() => {
    writeJson(USERS_STORAGE_KEY, registeredUsers);
  }, [registeredUsers]);

  useEffect(() => {
    writeJson(AUTH_STORAGE_KEY, authUser);
  }, [authUser]);

  const login = async ({ email, password, role }) => {
    const normalizedEmail = normalizeEmail(email);
    const normalizedRole = normalizeRole(role);

    if (!normalizedEmail || !password || !normalizedRole) {
      throw new Error('Enter a valid email, password, and role.');
    }

    const matchedUser = registeredUsers.find(
      (user) => user.email === normalizedEmail && user.password === password && user.role === normalizedRole
    );

    if (!matchedUser) {
      throw new Error('Invalid credentials for this role.');
    }

    const session = {
      name: matchedUser.name,
      email: matchedUser.email,
      role: matchedUser.role,
    };

    setAuthUser(session);
    return session;
  };

  const signup = async ({ name, email, password, role }) => {
    const normalizedName = String(name || '').trim();
    const normalizedEmail = normalizeEmail(email);
    const normalizedRole = normalizeRole(role);

    if (!normalizedName || !normalizedEmail || !password || !normalizedRole) {
      throw new Error('Fill in every field to create your account.');
    }

    const alreadyRegistered = registeredUsers.some((user) => user.email === normalizedEmail && user.role === normalizedRole);
    if (alreadyRegistered) {
      throw new Error('An account already exists for this role and email.');
    }

    const newUser = {
      name: normalizedName,
      email: normalizedEmail,
      password,
      role: normalizedRole,
    };

    setRegisteredUsers((currentUsers) => [...currentUsers, newUser]);
    const session = {
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    };
    setAuthUser(session);
    return session;
  };

  const logout = () => {
    setAuthUser(null);
  };

  const value = useMemo(
    () => ({
      authUser,
      login,
      signup,
      logout,
    }),
    [authUser, registeredUsers]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}