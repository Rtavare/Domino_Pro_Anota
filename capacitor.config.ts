import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.dominopro.anota',
  appName: 'Domino Pro',
  webDir: 'dist',
  android: {
    backgroundColor: '#080816',
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      launchShowDuration: 800,
      backgroundColor: '#080816',
      showSpinner: false,
    },
  },
};

export default config;
