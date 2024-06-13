const mongoose = require('mongoose')

const groupSchema = new mongoose.Schema({
  members: [
    {
      userId: {
        type: String,
        required: true
      },
      role: {
        type: String,
        required: false
      }
    }
  ]
})

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;