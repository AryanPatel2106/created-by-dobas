import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone, Monitor, Wifi, Zap } from 'lucide-react';

const PWAInstallPrompt = () => {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showBenefits, setShowBenefits] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Listen for PWA install events
    const handleInstallable = () => {
      setIsInstallable(true);
      // Show prompt after a delay to not be intrusive
      setTimeout(() => setIsVisible(true), 3000);
    };

    const handleInstalled = () => {
      setIsInstalled(true);
      setIsVisible(false);
      setIsInstallable(false);
    };

    window.addEventListener('pwa-installable', handleInstallable);
    window.addEventListener('pwa-installed', handleInstalled);

    return () => {
      window.removeEventListener('pwa-installable', handleInstallable);
      window.removeEventListener('pwa-installed', handleInstalled);
    };
  }, []);

  const handleInstall = () => {
    if (window.installPWA) {
      window.installPWA();
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    // Don't show again for this session
    sessionStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  // Don't show if already installed or dismissed
  if (isInstalled || !isInstallable || sessionStorage.getItem('pwa-prompt-dismissed')) {
    return null;
  }

  const benefits = [
    {
      icon: Zap,
      title: 'Faster Loading',
      description: 'Lightning-fast performance with offline caching'
    },
    {
      icon: Smartphone,
      title: 'Mobile Optimized',
      description: 'Native app-like experience on your phone'
    },
    {
      icon: Wifi,
      title: 'Works Offline',
      description: 'Browse products and content without internet'
    },
    {
      icon: Monitor,
      title: 'Desktop Ready',
      description: 'Install on desktop for quick access'
    }
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50"
        >
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-[var(--theme-pink)] to-pink-400 p-4 text-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  <span className="font-bold">Install App</span>
                </div>
                <button
                  onClick={handleDismiss}
                  className="p-1 hover:bg-black/10 rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-bold text-gray-800 mb-2">
                Get the Created by Dobas App
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Install our app for a better shopping experience with faster loading and offline access.
              </p>

              {/* Benefits Toggle */}
              <button
                onClick={() => setShowBenefits(!showBenefits)}
                className="text-sm text-[var(--theme-pink)] hover:text-pink-600 mb-4 transition-colors"
              >
                {showBenefits ? 'Hide' : 'Show'} benefits →
              </button>

              {/* Benefits List */}
              <AnimatePresence>
                {showBenefits && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mb-4 space-y-2"
                  >
                    {benefits.map((benefit, index) => {
                      const IconComponent = benefit.icon;
                      return (
                        <div key={index} className="flex items-start gap-2 text-xs">
                          <IconComponent className="w-4 h-4 text-[var(--theme-pink)] mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="font-medium text-gray-800">{benefit.title}</div>
                            <div className="text-gray-600">{benefit.description}</div>
                          </div>
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={handleInstall}
                  className="flex-1 bg-[var(--theme-pink)] text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-[var(--theme-pink-hover)] transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Install
                </button>
                <button
                  onClick={handleDismiss}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Later
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PWAInstallPrompt;
