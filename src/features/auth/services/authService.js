/**
 * Authentication Service
 * Handles authentication API calls with mock implementation
 */

import { AuthErrorCodes, UserRoles } from '../types';

// Mock users database
const MOCK_USERS = [
  {
    id: '1',
    email: 'admin@yoga.com',
    username: 'admin',
    password: 'admin123', // In production, this would be hashed
    pin: '1234', // In production, this would be hashed
    pinEnabled: true,
    pinAttempts: 0,
    pinLockedUntil: null,
    name: 'Admin User',
    role: UserRoles.ADMIN,
    avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=6366f1&color=fff',
    phone: '+1234567890',
    createdAt: '2024-01-01T00:00:00.000Z',
    lastLogin: null,
  },
  {
    id: '2',
    email: 'manager@yoga.com',
    username: 'manager',
    password: 'manager123',
    pin: '5678',
    pinEnabled: true,
    pinAttempts: 0,
    pinLockedUntil: null,
    name: 'Manager User',
    role: UserRoles.MANAGER,
    avatar: 'https://ui-avatars.com/api/?name=Manager+User&background=8b5cf6&color=fff',
    phone: '+1234567891',
    createdAt: '2024-01-15T00:00:00.000Z',
    lastLogin: null,
  },
  {
    id: '3',
    email: 'staff@yoga.com',
    username: 'staff',
    password: 'staff123',
    pin: '9012',
    pinEnabled: true,
    pinAttempts: 0,
    pinLockedUntil: null,
    name: 'Staff User',
    role: UserRoles.STAFF,
    avatar: 'https://ui-avatars.com/api/?name=Staff+User&background=ec4899&color=fff',
    phone: '+1234567892',
    createdAt: '2024-02-01T00:00:00.000Z',
    lastLogin: null,
  },
  {
    id: '4',
    email: 'instructor@yoga.com',
    username: 'instructor',
    password: 'instructor123',
    pin: '3456',
    pinEnabled: true,
    pinAttempts: 0,
    pinLockedUntil: null,
    name: 'Yoga Instructor',
    role: UserRoles.INSTRUCTOR,
    avatar: 'https://ui-avatars.com/api/?name=Yoga+Instructor&background=14b8a6&color=fff',
    phone: '+1234567893',
    createdAt: '2024-02-15T00:00:00.000Z',
    lastLogin: null,
  },
];

// Mock delay to simulate API latency
const mockDelay = (ms = 800) => new Promise((resolve) => setTimeout(resolve, ms));

// Generate mock JWT token
const generateToken = (userId) => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(
    JSON.stringify({
      userId,
      iat: Date.now(),
      exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    })
  );
  const signature = btoa(`mock-signature-${userId}`);
  return `${header}.${payload}.${signature}`;
};

// Generate mock refresh token
const generateRefreshToken = (userId) => {
  return btoa(`refresh-${userId}-${Date.now()}`);
};

/**
 * Mock login function
 * @param {import('../types').LoginCredentials} credentials
 * @returns {Promise<import('../types').AuthResponse>}
 */
export const login = async (credentials) => {
  await mockDelay();

  const { email, password } = credentials;

  // Validate input
  if (!email || !password) {
    throw {
      message: 'Email and password are required',
      code: AuthErrorCodes.INVALID_CREDENTIALS,
    };
  }

  // Find user
  const user = MOCK_USERS.find((u) => u.email === email);

  if (!user) {
    throw {
      message: 'User not found',
      code: AuthErrorCodes.USER_NOT_FOUND,
    };
  }

  // Verify password
  if (user.password !== password) {
    throw {
      message: 'Invalid credentials',
      code: AuthErrorCodes.INVALID_CREDENTIALS,
    };
  }

  // Update last login
  user.lastLogin = new Date().toISOString();

  // Generate tokens
  const token = generateToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  // Return user data without password and PIN
  const { password: _, pin: __, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    token,
    refreshToken,
    expiresIn: 86400, // 24 hours in seconds
  };
};

/**
 * Mock PIN login function
 * @param {import('../types').PINLoginCredentials} credentials
 * @returns {Promise<import('../types').AuthResponse>}
 */
export const loginWithPIN = async (credentials) => {
  await mockDelay();

  const { username, pin } = credentials;

  // Validate input
  if (!username || !pin) {
    throw {
      message: 'Username and PIN are required',
      code: AuthErrorCodes.INVALID_CREDENTIALS,
    };
  }

  // Validate PIN format (4-6 digits)
  if (!/^\d{4,6}$/.test(pin)) {
    throw {
      message: 'PIN must be 4-6 digits',
      code: AuthErrorCodes.INVALID_PIN,
    };
  }

  // Find user by username or email
  const user = MOCK_USERS.find(
    (u) => u.username === username || u.email === username
  );

  if (!user) {
    throw {
      message: 'User not found',
      code: AuthErrorCodes.USER_NOT_FOUND,
    };
  }

  // Check if PIN is enabled
  if (!user.pinEnabled) {
    throw {
      message: 'PIN authentication not enabled for this user',
      code: AuthErrorCodes.PIN_NOT_SET,
    };
  }

  // Check if PIN is locked
  if (user.pinLockedUntil && new Date(user.pinLockedUntil) > new Date()) {
    const lockTime = Math.ceil(
      (new Date(user.pinLockedUntil) - new Date()) / 1000 / 60
    );
    throw {
      message: `PIN is locked. Please try again in ${lockTime} minute(s)`,
      code: AuthErrorCodes.PIN_LOCKED,
    };
  }

  // Verify PIN
  if (user.pin !== pin) {
    // Increment failed attempts
    user.pinAttempts = (user.pinAttempts || 0) + 1;

    // Lock PIN after 5 failed attempts
    if (user.pinAttempts >= 5) {
      user.pinLockedUntil = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // Lock for 15 minutes
      throw {
        message: 'Too many failed attempts. PIN locked for 15 minutes.',
        code: AuthErrorCodes.PIN_LOCKED,
      };
    }

    throw {
      message: `Invalid PIN. ${5 - user.pinAttempts} attempts remaining`,
      code: AuthErrorCodes.INVALID_PIN,
    };
  }

  // Reset PIN attempts on successful login
  user.pinAttempts = 0;
  user.pinLockedUntil = null;

  // Update last login
  user.lastLogin = new Date().toISOString();

  // Generate tokens
  const token = generateToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  // Return user data without password and PIN
  const { password: _, pin: __, ...userWithoutSensitiveData } = user;

  return {
    user: userWithoutSensitiveData,
    token,
    refreshToken,
    expiresIn: 86400, // 24 hours in seconds
  };
};

/**
 * Mock logout function
 * @returns {Promise<void>}
 */
export const logout = async () => {
  await mockDelay(300);
  // In a real implementation, this would invalidate the token on the server
  return;
};

/**
 * Mock token refresh function
 * @param {string} refreshToken
 * @returns {Promise<{token: string, refreshToken: string, expiresIn: number}>}
 */
export const refreshToken = async (refreshToken) => {
  await mockDelay(500);

  if (!refreshToken) {
    throw {
      message: 'Refresh token is required',
      code: AuthErrorCodes.INVALID_TOKEN,
    };
  }

  try {
    // Decode refresh token to get user ID
    const decoded = atob(refreshToken);
    const userId = decoded.split('-')[1];

    // Verify user exists
    const user = MOCK_USERS.find((u) => u.id === userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Generate new tokens
    const newToken = generateToken(userId);
    const newRefreshToken = generateRefreshToken(userId);

    return {
      token: newToken,
      refreshToken: newRefreshToken,
      expiresIn: 86400,
    };
  } catch (error) {
    throw {
      message: 'Invalid or expired refresh token',
      code: AuthErrorCodes.INVALID_TOKEN,
    };
  }
};

/**
 * Mock get current user function
 * @param {string} token
 * @returns {Promise<import('../types').User>}
 */
export const getCurrentUser = async (token) => {
  await mockDelay(400);

  if (!token) {
    throw {
      message: 'Token is required',
      code: AuthErrorCodes.UNAUTHORIZED,
    };
  }

  try {
    // Decode token to get user ID
    const parts = token.split('.');
    const payload = JSON.parse(atob(parts[1]));
    const userId = payload.userId;

    // Check if token is expired
    if (payload.exp < Date.now()) {
      throw {
        message: 'Token has expired',
        code: AuthErrorCodes.EXPIRED_TOKEN,
      };
    }

    // Find user
    const user = MOCK_USERS.find((u) => u.id === userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    throw {
      message: 'Invalid token',
      code: AuthErrorCodes.INVALID_TOKEN,
    };
  }
};

/**
 * Mock verify token function
 * @param {string} token
 * @returns {Promise<boolean>}
 */
export const verifyToken = async (token) => {
  try {
    await getCurrentUser(token);
    return true;
  } catch {
    return false;
  }
};

/**
 * Set user PIN
 * @param {string} userId - User ID
 * @param {string} newPIN - New PIN (4-6 digits)
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const setPIN = async (userId, newPIN) => {
  await mockDelay();

  // Validate PIN format
  if (!/^\d{4,6}$/.test(newPIN)) {
    throw {
      message: 'PIN must be 4-6 digits',
      code: AuthErrorCodes.INVALID_PIN,
    };
  }

  // Find user
  const user = MOCK_USERS.find((u) => u.id === userId);
  if (!user) {
    throw {
      message: 'User not found',
      code: AuthErrorCodes.USER_NOT_FOUND,
    };
  }

  // Update PIN
  user.pin = newPIN;
  user.pinEnabled = true;
  user.pinAttempts = 0;
  user.pinLockedUntil = null;

  return {
    success: true,
    message: 'PIN set successfully',
  };
};

/**
 * Disable PIN authentication
 * @param {string} userId - User ID
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const disablePIN = async (userId) => {
  await mockDelay();

  // Find user
  const user = MOCK_USERS.find((u) => u.id === userId);
  if (!user) {
    throw {
      message: 'User not found',
      code: AuthErrorCodes.USER_NOT_FOUND,
    };
  }

  // Disable PIN
  user.pinEnabled = false;

  return {
    success: true,
    message: 'PIN authentication disabled',
  };
};

/**
 * Reset PIN attempts (admin action)
 * @param {string} userId - User ID
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const resetPINAttempts = async (userId) => {
  await mockDelay();

  // Find user
  const user = MOCK_USERS.find((u) => u.id === userId);
  if (!user) {
    throw {
      message: 'User not found',
      code: AuthErrorCodes.USER_NOT_FOUND,
    };
  }

  // Reset attempts
  user.pinAttempts = 0;
  user.pinLockedUntil = null;

  return {
    success: true,
    message: 'PIN attempts reset successfully',
  };
};

// Export auth service
export const authService = {
  login,
  loginWithPIN,
  logout,
  refreshToken,
  getCurrentUser,
  verifyToken,
  setPIN,
  disablePIN,
  resetPINAttempts,
};

export default authService;
