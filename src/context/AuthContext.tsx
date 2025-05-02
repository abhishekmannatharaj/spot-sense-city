
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserType } from '@/types';
import { toast } from '@/components/ui/sonner';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, userType: UserType) => Promise<void>;
  logout: () => void;
  updateUserType: (userType: UserType) => void;
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

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if the user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // For demo purposes, we'll use localStorage to persist the user
        const storedUser = localStorage.getItem('nexlot_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Authentication error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Mock login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      
      // This is just a mock - in a real app, we would validate credentials with a backend
      const mockUser: User = {
        id: `user_${Math.random().toString(36).substr(2, 9)}`,
        email,
        userType: 'vehicle_owner',
        createdAt: new Date(),
      };
      
      setUser(mockUser);
      localStorage.setItem('nexlot_user', JSON.stringify(mockUser));
      toast.success('Successfully logged in');
    } catch (error) {
      toast.error('Failed to login');
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Mock signup function
  const signup = async (email: string, password: string, userType: UserType) => {
    setIsLoading(true);
    try {
      // Mock API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      
      // This is just a mock - in a real app, we would register the user with a backend
      const mockUser: User = {
        id: `user_${Math.random().toString(36).substr(2, 9)}`,
        email,
        userType,
        createdAt: new Date(),
      };
      
      setUser(mockUser);
      localStorage.setItem('nexlot_user', JSON.stringify(mockUser));
      toast.success('Successfully registered');
    } catch (error) {
      toast.error('Failed to register');
      console.error('Signup error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nexlot_user');
    toast.success('Successfully logged out');
  };

  const updateUserType = (userType: UserType) => {
    if (!user) return;
    
    const updatedUser = { ...user, userType };
    setUser(updatedUser);
    localStorage.setItem('nexlot_user', JSON.stringify(updatedUser));
    toast.success(`User type updated to ${userType === 'vehicle_owner' ? 'Vehicle Owner' : 'Space Owner'}`);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        isLoading,
        login,
        signup,
        logout,
        updateUserType,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
