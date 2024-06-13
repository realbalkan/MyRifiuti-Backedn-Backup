const mongoose = require('mongoose')
const zone = require('./Zone')

//Schema calendar
const calendarSchema = new mongoose.Schema({
    zone: {
        type: String,
        enum: zone.circoscrizioni,
        required: true
    },
    organic: {
        type: Number,
        required: true
    },
    plastic: {
        type: Number,
        required: true
    },
    paper: {
        type: Number,
        required: true
    },
    residue: {
        type: Number,
        required: true
    },
    glass: {
        type: Number,
        required: true
    }
})

const Calendar = mongoose.model('Calendar', calendarSchema);

module.exports = Calendar;