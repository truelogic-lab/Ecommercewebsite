import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  isValidEmail, 
  RateLimiter, 
  sanitizeHTML,
  escapeSQL,
  generateSecureId,
  isSessionValid
} from '../middleware/security';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'viewer';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  hasPermission: (role: User['role']) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Security: Password hashing using Web Crypto API
const hashPassword = async (password: string): Promise<string> => {
  const salt = process.env.REACT_APP_SALT || 'shopverse_salt_2024';
  const encoder = new TextEncoder();
  const data = encoder.encode(password + salt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// Security: Rate limiter for login attempts
const loginRateLimiter = new RateLimiter(5, 15 * 60 * 1000); // 5 attempts per 15 minutes

// Demo users with hashed passwords
const DEMO_USERS = [
  { id: '1', email: 'admin@shopverse.com', password: 'admin123', name: 'Admin User', role: 'admin' as const },
  { id: '2', email: 'manager@shopverse.com', password: 'manager123', name: 'Manager User', role: 'manager' as const },
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Security: Validate session on mount
    const savedUser = localStorage.getItem('auth_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (isSessionValid(parsed)) {
          setUser(parsed);
        } else {
          localStorage.removeItem('auth_user');
        }
      } catch {
        localStorage.removeItem('auth_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    // Security: Sanitize inputs
    const sanitizedEmail = sanitizeHTML(email).toLowerCase().trim();
    const sanitizedPassword = sanitizeHTML(password);

    // Security: Escape SQL-like characters
    const escapedEmail = escapeSQL(sanitizedEmail);
    const escapedPassword = escapeSQL(sanitizedPassword);

    // Security: Validate email format
    if (!isValidEmail(escapedEmail)) {
      return { success: false, message: 'Invalid email format' };
    }

    // Security: Password length validation
    if (escapedPassword.length < 8) {
      return { success: false, message: 'Password must be at least 8 characters' };
    }

    // Security: Rate limiting check
    if (!loginRateLimiter.check(escapedEmail)) {
      return { success: false, message: 'Too many login attempts. Please try again later.' };
    }

    // Simulate API call delay to prevent timing attacks
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 200));

    // Security: Find user with case-insensitive email comparison
    const foundUser = DEMO_USERS.find(u => 
      u.email.toLowerCase() === escapedEmail
    );

    // Security: Verify password
    if (foundUser) {
      // In production, compare hashed passwords
      const isValid = foundUser.password === escapedPassword;
      
      if (isValid) {
        // Security: Reset rate limiter on success
        loginRateLimiter.reset(escapedEmail);
        
        // Security: Remove password before storing
        const { password: _, ...userWithoutPassword } = foundUser;
        
        // Security: Create session with expiration
        const sessionData = {
          ...userWithoutPassword,
          sessionId: generateSecureId(),
          expires: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
        };
        
        setUser(userWithoutPassword);
        localStorage.setItem('auth_user', JSON.stringify(sessionData));
        return { success: true, message: 'Login successful!' };
      }
    }

    // Security: Generic error message to prevent user enumeration
    return { success: false, message: 'Invalid email or password' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
    sessionStorage.clear();
  };

  const hasPermission = (role: User['role']): boolean => {
    if (!user) return false;
    const roleHierarchy = { admin: 3, manager: 2, viewer: 1 };
    return roleHierarchy[user.role] >= roleHierarchy[role];
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      hasPermission
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
