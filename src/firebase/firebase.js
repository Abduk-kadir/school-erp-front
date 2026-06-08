import { initializeApp, getApps, getApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: 'AIzaSyBAV0srwAj5I6hfKJ0b7aBvsHraZBmb4kw',
  authDomain: 'demoprojectabdul.firebaseapp.com',
  projectId: 'demoprojectabdul',
  storageBucket: 'demoprojectabdul.firebasestorage.app',
  messagingSenderId: '609482800144',
  appId: '1:609482800144:web:9533166523a15fed79de95',
  measurementId: 'G-KLH79GGTV1',
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const messaging = getMessaging(app);

export { app, messaging };
