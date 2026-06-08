import { getToken,onMessage } from 'firebase/messaging';
import { messaging } from '../firebase/firebase';

export const getFCMToken = async () => {
  const vapidKey ='BEJrvHyZOVXgdwqrKhFN-Z4yUWfGgtxUR5v0hsTouhU3BmW2pQsePyQgD8EQOcJLf9A1Nbp58yShZOgzsyyu2HQ';
  try {
    const token = await getToken(messaging, { vapidKey });
    console.log("FCM Token************", token);
    return token;
  } catch (error) {
    console.error("Error getting FCM token************", error);
    return null;
  }
};

export const onMessageListener = () => {
  onMessage(messaging, (payload) => {
    

    const { title, body } = payload.notification || {};
    const data = payload.data || {};

    // Browser Notification
    if (Notification.permission === "granted") {
      console.log("Notification Received in browser:::::::", payload);
      const displayTitle = data.notificationId
        ? `${title || "School ERP"} (#${data.notificationId})`
        : title || "School ERP";
      const notification = new Notification(displayTitle, {
        body: body || "You have a new notification",
        icon: "/logo.png",
        tag: `notification-${data.notificationId ?? "fcm"}-${Date.now()}`,
        renotify: true,
        data: data,
      });
      console.log("showNotification OK (foreground):", data.notificationId, notification);
    } 
    // In-App Notification
    else {
     
      showInAppNotification(title, body, data);
    }
  });
};