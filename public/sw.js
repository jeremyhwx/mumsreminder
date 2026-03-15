self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || "Mum's Reminder";
  const options = {
    body: data.body || 'Time to do it!',
    icon: '/icon.png',
    badge: '/icon.png',
    tag: 'reminder',
    requireInteraction: true, // stays on screen until tapped
    data: { reminderText: data.reminderText, reminderIcon: data.reminderIcon }
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const { reminderText, reminderIcon } = event.notification.data || {};
  const url = `/?alarm=1&text=${encodeURIComponent(reminderText || '')}&icon=${encodeURIComponent(reminderIcon || '🔔')}`;
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      if (clientList.length > 0) {
        clientList[0].focus();
        clientList[0].navigate(url);
      } else {
        clients.openWindow(url);
      }
    })
  );
});
