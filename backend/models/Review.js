const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' },
  user: {
    id: String,
    name: String,
  },
  rating: Number,
  text: String,
});

module.exports = mongoose.model('Review', reviewSchema);