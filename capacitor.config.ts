import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tentengan.app',
  appName: 'Tentengan',
  webDir: 'public',
  server: {
    url: 'https://app.tentengan.com/',
    cleartext: true
  },
  plugins: {
    GoogleAuth: {
      scopes: ["profile", "email"],
      serverClientId: "799984616839-fhibfgtrmglu3icdund7geau0uur7221.apps.googleusercontent.com",
      forceCodeForRefreshToken: true
    }
  }
};

export default config;
