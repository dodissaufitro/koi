import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tentengan.app',
  appName: 'Tentengan',
  webDir: 'public',
  server: {
    url: 'https://app.tentengan.com/',
    cleartext: true,
    allowNavigation: [
      'app.tentengan.com',
      'accounts.google.com',
      '*.google.com',
      '*.googleusercontent.com'
    ]
  },
  android: {
    overrideUserAgent: 'Mozilla/5.0 (Linux; Android 14; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Mobile Safari/537.36',
    allowMixedContent: true
  },
  plugins: {
    GoogleAuth: {
      scopes: ["profile", "email"],
      serverClientId: "799984616839-185sfi42idcj44s0u9bsj95km4cu9tm9.apps.googleusercontent.com",
      forceCodeForRefreshToken: true
    }
  }
};

export default config;
