importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyCShSjvz1ZBrgXrxVOG_X3u19U9coEdiGk",
  authDomain: "pioneer-cac-library.firebaseapp.com",
  projectId: "pioneer-cac-library",
  storageBucket: "pioneer-cac-library.appspot.com",
  messagingSenderId: "210205499554",
  appId: "1:376573340379:web:278435b2e3302495d7bafe"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Messaging
const messaging = firebase.messaging();

// Handle background notifications
messaging.onBackgroundMessage((payload) => {
  console.log("Received background message: ", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    // icon: payload.notification.icon,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
