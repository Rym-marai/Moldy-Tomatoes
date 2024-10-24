// routes/movies.js
const express = require('express');
const Movie = require('../../models/Movie');
const Review = require('../models/review');
const router = express.Router();

// Get all movies
router.get('/', async (req, res) => {
  const movies = await Movie.find().populate('reviews');
  res.json(movies);
});

// Add a new movie
router.post('/', async (req, res) => {
  const { title } = req.body;
  const movie = new Movie({ title });
  await movie.save();
  res.status(201).json(movie);
});

// Add a review to a movie
router.post('/:movieId/reviews', async (req, res) => {
  const { movieId } = req.params;
  const { reviewerName, rating, reviewText } = req.body;
  const review = new Review({ movie: movieId, reviewerName, rating, reviewText });
  await review.save();
  const movie = await Movie.findById(movieId);
  movie.reviews.push(review);
  await movie.save();
  res.status(201).json(review);
});

module.exports = router;