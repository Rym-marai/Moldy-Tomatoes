const express = require('express');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const Movie = require('../models/Movie'); // Ensure the correct import

const router = express.Router();

// Get all movies
router.get('/', authenticateToken, async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a new movie
router.post('/', authenticateToken, authorizeRole('admin'), async (req, res) => {
  const { title } = req.body;
  const movie = new Movie({ title, averageRating: 0, reviews: [] });

  try {
    const newMovie = await movie.save();
    res.status(201).json(newMovie);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a movie
router.delete('/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    await movie.remove();
    res.status(200).json({ message: 'Movie deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;