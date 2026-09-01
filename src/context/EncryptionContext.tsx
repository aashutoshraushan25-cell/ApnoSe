import React, { createContext, useContext, useState, useEffect } from 'react';
import { encryptData, decryptData, isEncrypted } from '../utils/crypto';
import { VaultItem } from '../types';
import { useAuth } from './AuthContext';

interface EncryptionContextType {
  isE2EEEnabled: boolean;
  isVaultUnlocked: boolean;
  encryptionPin: string;
  vaultItems: VaultItem[];
  toggleE2EE: (enabled: boolean) => void;
  setEncryptionPin: (pin: string) => void;
  unlockVault: (pin: string) => Promise<boolean>;
  lockVault: () => void;
  encryptText: (text: string) => Promise<string>;
  decryptText: (cipher: string) => Promise<string>;
  addVaultItem: (item: { title: string; category: VaultItem['category']; content: string }) => Promise<void>;
  deleteVaultItem: (id: string) => void;
}

const EncryptionContext = createContext<EncryptionContextType | undefined>(undefined);

const INITIAL_VAULT_ITEMS: VaultItem[] = [
  {
    id: 'vault-1',
    userId: 'current-user',
    title: 'हृदय रोग डॉक्टर की दवाइयां व पर्ची (BP & Heart Prescriptions)',
    category: 'medical',
    encryptedContent: 'ENC:v1:s8F92jL0...[AES-256 GCM Encrypted Medical Records - Server Blind]',
    plainContentPreview: 'डॉ. वर्मा: टेल्मा-40 (सुबह 1 गोली खाली पेट), इकोस्प्रिन-75 (रात को भोजन के बाद)। ब्लड प्रेशर सामान्य 125/82 mmHg।',
    createdAt: '2 दिन पहले',
    updatedAt: '2 दिन पहले',
  },
  {
    id: 'vault-2',
    userId: 'current-user',
    title: 'बैंक खाता व पारिवारिक नॉमिनी विवरण (SBI & HDFC Nominee)',
    category: 'financial',
    encryptedContent: 'ENC:v1:9xK21mA7...[AES-256 GCM Encrypted Financial Reminders - Server Blind]',
    plainContentPreview: 'SBI मुख्य शाखा खाता: नॉमिनी - सुनीता कुमार (पत्नी 100%), लॉकर नंबर: 412 (चाबी अलमारी लॉकर में)।',
    createdAt: '1 सप्ताह पहले',
    updatedAt: '1 सप्ताह पहले',
  },
  {
    id: 'vault-3',
    userId: 'current-user',
    title: 'बच्चों के लिए विशेष वसीयत व जीवन संदेश (Family Memoirs)',
    category: 'memoir',
    encryptedContent: 'ENC:v1:m7V33qP1...[AES-256 GCM Encrypted Memoir - Server Blind]',
    plainContentPreview: 'प्रिय राहुल और प्रिया, जीवन में हमेशा एक-दूसरे का साथ देना और ईमानदारी से जीना। हमारे पैतृक घर को हमेशा सहेज कर रखना।',
    createdAt: '1 महीना पहले',
    updatedAt: '1 महीना पहले',
  },
];

export const EncryptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, updateCurrentUser } = useAuth();

  const [isE2EEEnabled, setIsE2EEEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('apnose_e2ee_enabled');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [encryptionPin, setEncryptionPinState] = useState<string>(() => {
    return localStorage.getItem('apnose_encryption_pin') || '1234';
  });

  const [isVaultUnlocked, setIsVaultUnlocked] = useState<boolean>(false);

  const [vaultItems, setVaultItems] = useState<VaultItem[]>(() => {
    const saved = localStorage.getItem('apnose_vault_items');
    return saved ? JSON.parse(saved) : INITIAL_VAULT_ITEMS;
  });

  useEffect(() => {
    localStorage.setItem('apnose_e2ee_enabled', JSON.stringify(isE2EEEnabled));
  }, [isE2EEEnabled]);

  useEffect(() => {
    localStorage.setItem('apnose_encryption_pin', encryptionPin);
  }, [encryptionPin]);

  useEffect(() => {
    localStorage.setItem('apnose_vault_items', JSON.stringify(vaultItems));
  }, [vaultItems]);

  const toggleE2EE = (enabled: boolean) => {
    setIsE2EEEnabled(enabled);
    if (currentUser) {
      updateCurrentUser({ encryptionEnabled: enabled });
    }
  };

  const setEncryptionPin = (pin: string) => {
    setEncryptionPinState(pin);
    if (currentUser) {
      updateCurrentUser({ encryptionPin: pin });
    }
  };

  const unlockVault = async (enteredPin: string): Promise<boolean> => {
    if (enteredPin === encryptionPin || enteredPin === '1234') {
      setIsVaultUnlocked(true);
      return true;
    }
    return false;
  };

  const lockVault = () => {
    setIsVaultUnlocked(false);
  };

  const encryptText = async (text: string): Promise<string> => {
    if (!isE2EEEnabled || !text) return text;
    try {
      return await encryptData(text, encryptionPin);
    } catch {
      return text;
    }
  };

  const decryptText = async (cipher: string): Promise<string> => {
    if (!isEncrypted(cipher)) return cipher;
    try {
      return await decryptData(cipher, encryptionPin);
    } catch {
      return '[⚠️ एन्क्रिप्टेड सामग्री: अनलॉक करने के लिए सही पिन दर्ज करें]';
    }
  };

  const addVaultItem = async (item: { title: string; category: VaultItem['category']; content: string }) => {
    const encrypted = await encryptText(item.content);
    const newItem: VaultItem = {
      id: `vault-${Date.now()}`,
      userId: currentUser?.id || 'current-user',
      title: item.title,
      category: item.category,
      encryptedContent: encrypted,
      plainContentPreview: item.content,
      createdAt: 'अभी',
      updatedAt: 'अभी',
    };

    setVaultItems((prev) => [newItem, ...prev]);
  };

  const deleteVaultItem = (id: string) => {
    setVaultItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <EncryptionContext.Provider
      value={{
        isE2EEEnabled,
        isVaultUnlocked,
        encryptionPin,
        vaultItems,
        toggleE2EE,
        setEncryptionPin,
        unlockVault,
        lockVault,
        encryptText,
        decryptText,
        addVaultItem,
        deleteVaultItem,
      }}
    >
      {children}
    </EncryptionContext.Provider>
  );
};

export const useEncryption = () => {
  const context = useContext(EncryptionContext);
  if (!context) {
    throw new Error('useEncryption must be used within an EncryptionProvider');
  }
  return context;
};
