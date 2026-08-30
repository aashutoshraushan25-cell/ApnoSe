import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Language } from '../types';
import { CURRENT_USER, DEMO_USERS } from '../data/mockData';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (identifier: string, passOrOtp: string) => Promise<{ success: boolean; message?: string }>;
  register: (userData: {
    name: string;
    age: number;
    mobile: string;
    email: string;
    password?: string;
    location: string;
    preferredLanguage: Language;
    avatar?: string;
  }) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  switchUser: (userId: string) => void;
  availableUsers: User[];
  updateCurrentUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('apnose_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return CURRENT_USER;
      }
    }
    return CURRENT_USER; // Default logged in for smooth instant experience
  });

  const [availableUsers, setAvailableUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('apnose_all_users');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEMO_USERS;
      }
    }
    return DEMO_USERS;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('apnose_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('apnose_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('apnose_all_users', JSON.stringify(availableUsers));
  }, [availableUsers]);

  const login = async (identifier: string, passOrOtp: string): Promise<{ success: boolean; message?: string }> => {
    // Check if user exists by email or mobile
    const trimmed = identifier.trim().toLowerCase();
    const user = availableUsers.find(
      (u) => u.mobile.includes(trimmed) || u.email.toLowerCase() === trimmed
    ) || availableUsers[0]; // fallback for easy demo login

    if (user) {
      setCurrentUser(user);
      return { success: true };
    }

    return { success: false, message: 'उपयोगकर्ता नहीं मिला। कृपया सही मोबाइल नंबर या ईमेल दर्ज करें।' };
  };

  const register = async (userData: {
    name: string;
    age: number;
    mobile: string;
    email: string;
    password?: string;
    location: string;
    preferredLanguage: Language;
    avatar?: string;
  }): Promise<{ success: boolean; message?: string }> => {
    // Enforce 40+ age requirement!
    if (userData.age < 40) {
      return {
        success: false,
        message: 'Apno Se केवल 40 वर्ष या उससे अधिक आयु के प्रियजनों के लिए है। आपके स्नेह के लिए धन्यवाद!',
      };
    }

    if (!userData.name.trim()) {
      return { success: false, message: 'कृपया अपना पूरा नाम दर्ज करें।' };
    }

    if (!userData.mobile.trim() && !userData.email.trim()) {
      return { success: false, message: 'कृपया अपना मोबाइल नंबर या ईमेल दर्ज करें।' };
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: userData.name,
      age: userData.age,
      mobile: userData.mobile || '+91 98000 00000',
      email: userData.email || `${userData.name.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      avatar: userData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      coverImage: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&q=80&w=1200',
      location: userData.location || 'भारत',
      preferredLanguage: userData.preferredLanguage || 'hi',
      bio: 'अपनों से जुड़े रहने की एक नई शुरुआत। 🌸',
      joinedDate: 'आज',
      isVerified: true,
      interests: ['परिवार', 'यादें', 'संस्कृति'],
    };

    setAvailableUsers((prev) => [newUser, ...prev]);
    setCurrentUser(newUser);
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchUser = (userId: string) => {
    const found = availableUsers.find((u) => u.id === userId);
    if (found) {
      setCurrentUser(found);
    }
  };

  const updateCurrentUser = (updates: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    setAvailableUsers((prev) =>
      prev.map((u) => (u.id === updated.id ? updated : u))
    );
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        login,
        register,
        logout,
        switchUser,
        availableUsers,
        updateCurrentUser,
      }}
    >
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
