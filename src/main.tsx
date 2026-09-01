import React from 'react';
import ReactDOM from 'react-dom/client';
import { MainAppContent } from './App';
import { LanguageProvider } from './context/LanguageContext';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { AuthProvider } from './context/AuthContext';
import { EncryptionProvider } from './context/EncryptionContext';
import { AppProvider } from './context/AppContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LanguageProvider>
      <AccessibilityProvider>
        <AuthProvider>
          <EncryptionProvider>
            <AppProvider>
              <MainAppContent />
            </AppProvider>
          </EncryptionProvider>
        </AuthProvider>
      </AccessibilityProvider>
    </LanguageProvider>
  </React.StrictMode>
);
