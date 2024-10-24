const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  userId: String,
  rating: Number,
  text: String,
});

const movieSchema = new mongoose.Schema({
  title: String,
  averageRating: Number,
  reviews: [reviewSchema],
});

module.exports = mongoose.model('Movie', movieSchema);