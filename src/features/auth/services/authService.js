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
    password: 'admin123', // In production, this would be hashed
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
    password: 'manager123',
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
    password: 'staff123',
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
    password: 'instructor123',
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

  // Return user data without password
  const { password: _, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
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

// Export auth service
export const authService = {
  login,
  logout,
  refreshToken,
  getCurrentUser,
  verifyToken,
};

export default authService;
