// public/service-worker.js
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  
  // Extract the URL from the notification data
  const urlToOpen = event.notification.data.url || '/';

  event.waitUntil(
    clients.openWindow(urlToOpen)
  );
});