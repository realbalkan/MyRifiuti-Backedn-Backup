const mongoose = require('mongoose')
const Promise = require('bluebird')
const bcrypt = Promise.promisifyAll(require('bcryptjs'))
const Zone = require('./Zone')

// Schema user
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: false,
    trim: true
  },
  surname: {
    type: String,
    required: true,
    unique: false,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  zone: {
    type: String,
    enum: Zone.zones,
    required: true
  }
}, { timestamps: true }); // `timestamps` add `createdAt` and `updatedAt`

// Middleware to hashare password before saving User
userSchema.pre('save', async function(next) {
  const user = this;

  // Hash only if new or updated
  if (!user.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    next();
  } catch (error) {
    return next(error);
  }
});

//Method to comprare enctypted password
userSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;

