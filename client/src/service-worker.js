self.addEventListener('push', (event) => {
  const options = {
    body: event.data.text(),
    icon: '../public/img/icons8-cloche-96.png',
  };

  event.waitUntil(
    self.registration.showNotification('Nouveau message', options)
  );
});
