console.log('service worker work')
self.addEventListener('notificationclick', function(event) {
  var notif = event.notification
  var action = event.action
  console.log(notif)
  console.log(action)
  if (action == 'confirm') {
    console.log('Okay di jalankan')
    notif.close()
  } else {
    console.log('tidak di jalankan')
    notif.close()
  }
})

self.addEventListener('notificationclose', function(event) {
  console.log('notification di tutup')
})

//listen push event dari server notifikasi
self.addEventListener('push', function(event) {
  console.log('notifikasi diterima', event)
  if (event.data) {
    data = JSON.parse(event.data.text())
  }
  let opt = {
    body: data.content, //adalah text dari notifikasi yang lebih jelas dari title
    icon: './icons/app-icon-96x96.png', // bisa url ke luar atau local image
    image: './icon.png', // memunculkan image di notifikasi
    dir: 'ltr', // left to right (ltr) atau right to left (rtl)
    lang: 'en-US', //standard
    vibrate: [100, 50, 200], // device bergetar apabila ada notifikasi
    badge: './icon.png', // icon kecil di drawer
    // sound: '../notif.mp3', // sound saat notifikasi masuk (belum semua support)
    //! advance option
    // tag: 'confirm-notification', // kita men set tag agar notifikasi tidak menstack di device
    // renotify: true, // apabila tag sama di dalam beberapa notifikasi, maka status notifikasi akan dianggap baru dan device akan bergetar, jadi apabila false maka tag sama device tidak akan bergetar
    actions: [
      //! aksi saat notifikasi di pilih
      {
        action: 'confirm',
        title: 'Yes',
        icon: './icon.png'
      },
      {
        action: 'cancel',
        title: 'No',
        icon: './icon.png'
      }
    ]
  }
  event.waitUntil(self.registration.showNotification(data.title, opt))
})
