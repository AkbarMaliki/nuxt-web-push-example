//! ========== INIT ========================
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const multipart = require('connect-multiparty')()
const webpush = require('web-push')

//! ========= ENV VARIABLE ==================
const keys = require('../application-keys.json')
//! ========= Mongodb Conn ==================
let mongoURI = keys.mongodb
mongoose.connect(
  mongoURI,
  {
    useNewUrlParser: true
  }
)

//! ========== EXPRESS MIDDLEWARE ===========
// Install middleware
app.use(bodyParser.json())
//! ========== SET VAPID KEYS ===============
webpush.setVapidDetails(
  process.env.SENDER_EMAIL || 'mailto:mrrudyska@gmail.com',
  keys.publicKey,
  keys.privateKey
)
//! ========== AMBIL SCHEMA =================
// ambil schema untuk input ke database mongodb
var Subs = require('./schema').Subscription
//! =============== ROUTE ===================
app.post('/add/subscription', multipart, function(req, res) {
  let data = {
    ...req.body,
    expirationTime: null
  }
  Subs.create(data, function(err, dataAkhir) {
    if (err) console.log(err)
    res.json({})
  })
})
app.post('/post/notifikasi', multipart, function(req, res) {
  console.log(req.body)
  const params = {
    title: req.body.title ? req.body.title : 'kosong',
    content: req.body.content ? req.body.content : 'kosong'
  }
  Subs.find({}, function(err, subscribers) {
    Promise.all(
      subscribers.map(subscription => {
        let payload = {
          endpoint: subscription.endpoint,
          expirationTime: subscription.expirationTime,
          keys: {
            auth: subscription.keys.auth,
            p256dh: subscription.keys.p256dh
          }
        }
        console.log(payload)
        return webpush.sendNotification(payload, JSON.stringify(params), {})
      })
    )
      .then(ress => {
        res.json({})
      })
      .catch(err => console.log('ERROR', err))
  })
})
//! ============== EXPORT ================
module.exports = {
  path: '/api',
  handler: app
}
