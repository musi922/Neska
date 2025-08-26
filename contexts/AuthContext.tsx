import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Storage, STORAGE_KEYS } from '@/utils/storage';
import { api } from '@/utils/api';
import { Analytics } from '@/utils/analytics';

interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  avatar: string;
  bio?: string;
  isVerified: boolean;
  isElite: boolean;
  stats: {
    followers: number;
    following: number;
    posts: number;
    streaks: number;
  };
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: any) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<{ success: boolean; error?: string }>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const token = await Storage.getItem<string>(STORAGE_KEYS.AUTH_TOKEN);
      const userData = await Storage.getItem<User>(STORAGE_KEYS.USER_PROFILE);

      if (token && userData) {
        api.setAuthToken(token);
        setUser(userData);
        Analytics.identify(userData.id, {
          username: userData.username,
          email: userData.email,
        });
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await api.login(email, password);

      if (response.success && response.data) {
        const { user: userData, token } = response.data;
        
        await Storage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
        await Storage.setItem(STORAGE_KEYS.USER_PROFILE, userData);
        
        api.setAuthToken(token);
        setUser(userData);
        
        Analytics.identify(userData.id, {
          username: userData.username,
          email: userData.email,
        });
        Analytics.track('Login Success');

        return { success: true };
      } else {
        Analytics.track('Login Failed', { error: response.error });
        return { success: false, error: response.error || 'Login failed' };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      Analytics.track('Login Failed', { error: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any) => {
    try {
      setIsLoading(true);
      const response = await api.register(userData);

      if (response.success && response.data) {
        const { user: newUser, token } = response.data;
        
        await Storage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
        await Storage.setItem(STORAGE_KEYS.USER_PROFILE, newUser);
        
        api.setAuthToken(token);
        setUser(newUser);
        
        Analytics.identify(newUser.id, {
          username: newUser.username,
          email: newUser.email,
        });
        Analytics.track('Signup Success');

        return { success: true };
      } else {
        return { success: false, error: response.error || 'Registration failed' };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.logout();
      await Storage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      await Storage.removeItem(STORAGE_KEYS.USER_PROFILE);
      
      api.removeAuthToken();
      setUser(null);
      
      Analytics.track('Logout');
      Analytics.reset();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      if (!user) return { success: false, error: 'No user logged in' };

      const response = await api.updateProfile(user.id, data);

      if (response.success && response.data) {
        const updatedUser = { ...user, ...response.data };
        setUser(updatedUser);
        await Storage.setItem(STORAGE_KEYS.USER_PROFILE, updatedUser);
        
        Analytics.track('Profile Updated');
        return { success: true };
      } else {
        return { success: false, error: response.error || 'Update failed' };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Update failed';
      return { success: false, error: errorMessage };
    }
  };

  const refreshUser = async () => {
    try {
      if (!user) return;

      const response = await api.getProfile(user.id);
      if (response.success && response.data) {
        setUser(response.data);
        await Storage.setItem(STORAGE_KEYS.USER_PROFILE, response.data);
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};