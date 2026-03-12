const mongoose = require('mongoose');

const poemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  pinyin: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Poem = mongoose.model('Poem', poemSchema);

module.exports = Poem;