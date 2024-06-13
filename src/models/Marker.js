const mongoose = require('mongoose')

const markerSchema = new mongoose.Schema({
  lat: {
    type: Number,
    required: true,
    unique: false,
    trim: true 
  },
  lng: {
    type: Number,
    required: true,
    unique: false,
    trim: true 
  },
  label: {
    type: String,
    required: true,
    unique: false,
    trim: false
  }
});

const Marker = mongoose.model('Marker', markerSchema);

module.exports = Marker;