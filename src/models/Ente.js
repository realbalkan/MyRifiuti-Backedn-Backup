const mongoose = require('mongoose')
const Promise = require('bluebird')
const bcrypt = Promise.promisifyAll(require('bcryptjs'))

// Schema Ente
const enteSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: false,
    trim: true
  },
  password: {
    type: String,
    required: true
  }
}); // `timestamps` add `createdAt` and `updatedAt`

//Method to comprare enctypted password
enteSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const Ente = mongoose.model('Ente', enteSchema);

module.exports = Ente;

