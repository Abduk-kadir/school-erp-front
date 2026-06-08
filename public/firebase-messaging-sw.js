importScripts('https://www.gstatic.com/firebasejs/12.14.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.14.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyBAV0srwAj5I6hfKJ0b7aBvsHraZBmb4kw',
  authDomain: 'demoprojectabdul.firebaseapp.com',
  projectId: 'demoprojectabdul',
  storageBucket: 'demoprojectabdul.firebasestorage.app',
  messagingSenderId: '609482800144',
  appId: '1:609482800144:web:9533166523a15fed79de95',
  measurementId: 'G-KLH79GGTV1',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('notification received in background*******')
  const { title, body } = payload.notification || {};
  console.log("title::::::::",title)
  console.log('body::::::::',body)
  console.log('payload:::::::::::', payload.data?.notificationId);

  // Always unique tag — using only notificationId (e.g. "96", "97") with same
  // title/body makes the browser replace/suppress the popup after the first one.
  const notificationId = payload.data?.notificationId;
  const displayTitle = notificationId
    ? `${title || 'Notification'} (#${notificationId})`
    : title || 'Notification';
  const tag = `notification-${notificationId ?? 'fcm'}-${Date.now()}`;

  self.registration
    .showNotification(displayTitle, {
      body: body || '',
      tag: String(tag),
      renotify: true,
      icon: '/logo.png',
    })
    .then(() => {
      console.log('showNotification OK:', notificationId);
    })
    .catch((err) => {
      console.error('showNotification FAILED:', notificationId, err);
    });
});
