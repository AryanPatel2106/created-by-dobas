import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import OfflineIndicator from './components/OfflineIndicator';
import LoyaltyWidget from './components/LoyaltyWidget';
import { AuthProvider } from './context/AuthContext';
import { CheckoutProvider } from './context/CheckoutContext';

function App() {
  return (
    <div className="flex flex-col min-h-screen font-inter">
      <AuthProvider>
        <CheckoutProvider>
          <Header />
          <main className="py-8 flex-grow">
            <div className="container mx-auto px-4">
              <Outlet />
            </div>
          </main>
          <Footer />
          
          {/* PWA Components */}
          <PWAInstallPrompt />
          <OfflineIndicator />
          <LoyaltyWidget />
        </CheckoutProvider>
      </AuthProvider>
    </div>
  );
}

export default App;