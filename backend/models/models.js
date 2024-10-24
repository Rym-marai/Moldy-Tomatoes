const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: String,
  average_rating: Number,
});

const reviewSchema = new mongoose.Schema({
  movieId: mongoose.Schema.Types.ObjectId,
  user: {
    id: String,
    name: String,
  },
  rating: Number,
  text: String,
});

const Movie = mongoose.model('Movie', movieSchema);
const Review = mongoose.model('Review', reviewSchema);

module.exports = { Movie, Review };