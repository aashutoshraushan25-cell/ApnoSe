import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Language } from '../types';
import { CURRENT_USER, DEMO_USERS } from '../data/mockData';
import { authApi } from '../services/authApi';
import { apiClient } from '../services/apiClient';
import { socketService } from '../services/socketService';
import { mapBackendUserToFrontend } from '../utils/mappers';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (identifier: string, passOrOtp: string) => Promise<{ success: boolean; message?: string }>;
  register: (userData: {
    name: string;
    age: number;
    dateOfBirth?: string;
    mobile: string;
    email: string;
    password?: string;
    location: string;
    preferredLanguage: Language;
    avatar?: string;
    privacyAgreed?: boolean;
    encryptionEnabled?: boolean;
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
        return null;
      }
    }
    return null;
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

  // Verify active session with backend on initial load
  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem('apnose_access_token');
      if (!token) return;

      try {
        const res = await authApi.getMe();
        if (res.success && res.data) {
          const user = mapBackendUserToFrontend(res.data);
          setCurrentUser(user);
          socketService.connect(token);
        }
      } catch {
        // Fallback to local session
      }
    };

    checkSession();
  }, []);

  // Save current user & sync socket
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('apnose_current_user', JSON.stringify(currentUser));
        socketService.connect();
      } else {
        localStorage.removeItem('apnose_current_user');
        socketService.disconnect();
      }
    } catch (e) {
      console.warn('localStorage quota warning for currentUser:', e);
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem('apnose_all_users', JSON.stringify(availableUsers));
    } catch (e) {
      console.warn('localStorage quota warning for availableUsers:', e);
    }
  }, [availableUsers]);

  const login = async (identifier: string, passOrOtp: string): Promise<{ success: boolean; message?: string }> => {
    const cleanIdentifier = identifier.trim();
    if (!cleanIdentifier) {
      return { success: false, message: 'कृपया अपना मोबाइल नंबर या ईमेल दर्ज करें।' };
    }

    // 1. Try Backend REST API first
    try {
      const res = await authApi.login(cleanIdentifier, passOrOtp || 'demo');
      if (res.success && res.data) {
        apiClient.setTokens(res.data.accessToken, res.data.refreshToken);
        const mappedUser = mapBackendUserToFrontend(res.data.user);
        setCurrentUser(mappedUser);
        localStorage.setItem('apnose_current_user', JSON.stringify(mappedUser));

        // Connect live Socket.IO
        socketService.connect(res.data.accessToken);
        return { success: true };
      } else if (res.message) {
        return { success: false, message: res.message };
      }
    } catch {
      // Backend not running or offline, proceed with local fallback
    }

    // 2. Local fallback login (for offline / demo mode)
    const matchedUser = availableUsers.find(
      (u) =>
        u.mobile.replace(/\D/g, '') === cleanIdentifier.replace(/\D/g, '') ||
        u.email.toLowerCase() === cleanIdentifier.toLowerCase() ||
        u.name.toLowerCase().includes(cleanIdentifier.toLowerCase()) ||
        u.id === cleanIdentifier
    );

    if (matchedUser) {
      setCurrentUser(matchedUser);
      localStorage.setItem('apnose_current_user', JSON.stringify(matchedUser));
      return { success: true };
    }

    // If OTP was 1234 or identifier looks like phone number, create quick user
    if (passOrOtp === '1234' || cleanIdentifier.replace(/\D/g, '').length === 10) {
      const cleanNum = cleanIdentifier.replace(/\D/g, '');
      const quickUser: User = {
        id: `user-${Date.now()}`,
        name: 'वरिष्ठ सदस्य',
        age: 52,
        mobile: `+91 ${cleanNum}`,
        email: `${cleanNum}@apnose.in`,
        bio: 'अपनों से जुड़ा हुआ वरिष्ठ सदस्य',
        interests: ['परिवार', 'संस्कृति', 'बागवानी'],
        location: 'नई दिल्ली',
        preferredLanguage: 'hi',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400',
        coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1200',
        joinedDate: 'आज',
        privacyAgreed: true,
        encryptionEnabled: true,
      };

      setAvailableUsers((prev) => [quickUser, ...prev]);
      setCurrentUser(quickUser);
      localStorage.setItem('apnose_current_user', JSON.stringify(quickUser));
      return { success: true };
    }

    return {
      success: false,
      message: 'खाता नहीं मिला। कृपया अपना मोबाइल नंबर जांचें या नया खाता बनाएं।',
    };
  };

  const register = async (userData: {
    name: string;
    age: number;
    dateOfBirth?: string;
    mobile: string;
    email: string;
    password?: string;
    location: string;
    preferredLanguage: Language;
    avatar?: string;
    privacyAgreed?: boolean;
    encryptionEnabled?: boolean;
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

    // Calculate approximate date of birth from age if not provided
    const birthYear = new Date().getFullYear() - userData.age;
    const dobString = userData.dateOfBirth || `${birthYear}-01-01`;

    // 1. Try Backend REST Registration First
    try {
      const res = await authApi.register({
        name: userData.name.trim(),
        email: userData.email?.trim(),
        phone: userData.mobile?.trim(),
        password: userData.password || '123456',
        dateOfBirth: dobString,
        location: userData.location,
        language: userData.preferredLanguage,
        profilePhoto: userData.avatar,
        encryptionEnabled: userData.encryptionEnabled,
      });

      if (res.success && res.data) {
        apiClient.setTokens(res.data.accessToken, res.data.refreshToken);
        const mappedUser = mapBackendUserToFrontend(res.data.user);
        setAvailableUsers((prev) => [mappedUser, ...prev]);
        setCurrentUser(mappedUser);
        socketService.connect(res.data.accessToken);
        return { success: true };
      } else if (res.message) {
        return { success: false, message: res.message };
      }
    } catch {
      // Backend not running, proceed to local registration
      console.info('Backend unavailable, saving newly registered user locally');
    }

    // 2. Local Registration Fallback
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: userData.name,
      age: userData.age,
      mobile: userData.mobile || '+91 98000 00000',
      email: userData.email || `${userData.name.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      password: userData.password || '123456',
      avatar: userData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      coverImage: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&q=80&w=1200',
      location: userData.location || 'भारत',
      preferredLanguage: userData.preferredLanguage || 'hi',
      bio: 'अपनों से जुड़े रहने की एक नई शुरुआत। 🌸',
      joinedDate: 'आज',
      isVerified: true,
      interests: ['परिवार', 'यादें', 'संस्कृति'],
      privacyAgreed: userData.privacyAgreed ?? true,
      encryptionEnabled: userData.encryptionEnabled ?? true,
    };

    setAvailableUsers((prev) => [newUser, ...prev]);
    setCurrentUser(newUser);
    return { success: true };
  };

  const logout = () => {
    apiClient.clearTokens();
    socketService.disconnect();
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
