const mongoose = require('mongoose');

const checkinSchema = new mongoose.Schema({
  child: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Child',
    required: true,
  },
  poem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Poem',
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  familiarity: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  lastCheckedIn: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Checkin = mongoose.model('Checkin', checkinSchema);

module.exports = Checkin;