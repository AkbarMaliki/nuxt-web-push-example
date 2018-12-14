<template>
  <div>
    <div class="container flex flex-wrap mx-auto px-4">
      <div class="w-full sm:w-1/2 rounded-lg p-2" style="box-shadow:1px 2px 4px gray;">
        <h2>Daftar Mendapatkan Notifikasi</h2>
        <br>
        <button
          type="button"
          @click="permission"
          class="aktif-notif hover:bg-white hover:text-black bg-blue p-2 border-solid rounded-lg"
        >Subscribe</button>
        <br>
      </div>
      <div class="w-full sm:w-1/2 rounded-lg p-2" style="box-shadow:1px 2px 4px gray;">
        <h2>Kirim Notifikasi</h2>
        <br>
        <form action="#" @submit.prevent="kirim">
          <div class="mb-4">
            <label class="block text-grey-darker text-sm font-bold mb-2" for="title">title</label>
            <input
              class="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker leading-tight focus:outline-none focus:shadow-outline"
              id="title"
              type="text"
              placeholder="title"
              v-model="vdata.title"
            >
          </div>
          <div class="mb-4">
            <label class="block text-grey-darker text-sm font-bold mb-2" for="content">content</label>
            <input
              class="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker leading-tight focus:outline-none focus:shadow-outline"
              id="content"
              type="text"
              placeholder="content"
              v-model="vdata.content"
            >
          </div>
          <button
            type="submit"
            class="hover:bg-white hover:text-black bg-green-light p-2 border-solid rounded-lg"
          >Notifikasi</button>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
const keys = require('../application-keys.json')
export default {
  data() {
    return {
      vdata: {}
    }
  },
  methods: {
    kirim() {
      axios
        .post('http://localhost:3000/api/post/notifikasi', this.vdata)
        .then(res => {
          console.log(res)
        })
    },
    permission() {
      if ('Notification' in window) {
        Notification.requestPermission(result => {
          // cek apakah user menerima notifiksinya
          if (result !== 'granted') {
            console.log('notifikasi tidak di perbolehkan')
          } else {
            this.confPushSub()
            console.log('notifikasi aktif')
          }
        })
      } else {
        alert('notifikasi tidak didukung ')
      }
    },
    confPushSub() {
      let that = this
      if (!('serviceWorker' in navigator)) {
        // cek apakah service worker ada/tidak
        return
      }
      navigator.serviceWorker.ready.then(function(sw) {
        console.log(sw)
        sw.pushManager.getSubscription().then(sub => {
          // cek apakah device ini sudah subscribe atau belum
          if (sub === null) {
            sw.pushManager
              .subscribe({
                userVisibleOnly: true,
                applicationServerKey: that.urlB64ToUint8Array(keys.publicKey)
              })
              .then(subscription => {
                console.log('Subscribe OK:', subscription)
                return fetch('http://localhost:3000/api/add/subscription', {
                  method: 'POST',
                  body: JSON.stringify(subscription.toJSON()),
                  headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                  }
                })
              })
              .then(() => {
                that.newNotif('Berhasil Subscribe')
                console.log('Server Stored Subscription.')
              })
              .catch(err => {
                console.log('Subscribe Error:', err)
              })
          } else {
            that.newNotif('Subscribtion sudah ada')
          }
        })
      })
    },
    newNotif(msg) {
      // cek apakah service worker sudah teregister
      let opt = {
        body: msg, //adalah text dari notifikasi yang lebih jelas dari title
        icon: '../icons/app-icon-96x96.png', // bisa url ke luar atau local image
        image: '../icon.png', // memunculkan image di notifikasi
        dir: 'ltr', // left to right (ltr) atau right to left (rtl)
        lang: 'en-US', //standard
        vibrate: [100, 50, 200], // device bergetar apabila ada notifikasi
        badge: '../icon.png', // icon kecil di drawer
        // sound: '../notif.mp3', // sound saat notifikasi masuk (belum semua support)
        //! advance option
        // tag: 'confirm-notification', // kita men set tag agar notifikasi tidak menstack di device
        // renotify: true, // apabila tag sama di dalam beberapa notifikasi, maka status notifikasi akan dianggap baru dan device akan bergetar, jadi apabila false maka tag sama device tidak akan bergetar
        actions: [
          //! list aksi saat notifikasi di pilih
          {
            action: 'confirm',
            title: 'Yes',
            icon: '../icon.png'
          },
          {
            action: 'cancel',
            title: 'No',
            icon: '../icon.png'
          }
        ]
      }
      //! cara memunculkan notifikasi dengan windows object
      // new Notification('new notif', opt)
      //! cara menjalankan notifikasi dari service worker melalui navigator
      if ('serviceWorker' in navigator) {
        // apabila service worker ada , maka jalankan notifikasi melalui service worker
        navigator.serviceWorker.ready.then(function(sw) {
          // service worker menjalankan notifikasi
          sw.showNotification('Subscribe', opt)
        })
      }
    },
    urlB64ToUint8Array(base64String) {
      const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
      const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/')
      const rawData = window.atob(base64)
      const outputArray = new Uint8Array(rawData.length)
      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i)
      }
      return outputArray
    }
  }
}
</script>
