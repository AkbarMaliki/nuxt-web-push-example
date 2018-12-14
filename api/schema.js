var mongoose = require('mongoose')
let subscriptionSchema = new mongoose.Schema({
  endpoint: String,
  expirationTime: {
    type: String,
    default: null
  },
  keys: {
    auth: String,
    p256dh: String
  }
})
let Subscription = mongoose.model('subscription', subscriptionSchema)
module.exports = {
  Subscription
}
