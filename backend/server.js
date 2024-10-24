const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Movie = require('./models/Movie'); // Import the Movie model
const authRoutes = require('./routes/auth'); // Import auth routes
const config = require('./config'); // Import the configuration file

const app = express();
const port = config.port;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(config.mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Use auth routes
app.use('/auth', authRoutes);

// API endpoint to get movies
app.get('/movies', async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// API endpoint to get movie details
app.get('/movies/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// API endpoint to add a new movie
app.post('/movies', async (req, res) => {
  const { title, averageRating, reviews } = req.body;
  const movie = new Movie({ title, averageRating, reviews });
  try {
    const savedMovie = await movie.save();
    res.status(201).json(savedMovie);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// API endpoint to add a review to a movie
app.post('/movies/:id/reviews', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    const { userId, rating, text } = req.body;
    movie.reviews.push({ userId, rating, text });

    // Calculate the new average rating
    const totalRating = movie.reviews.reduce((sum, review) => sum + review.rating, 0);
    movie.averageRating = totalRating / movie.reviews.length;

    await movie.save();
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// API endpoint to delete a review
app.delete('/movies/:movieId/reviews/:reviewId', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.movieId);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    movie.reviews.id(req.params.reviewId).remove();

    // Calculate the new average rating
    const totalRating = movie.reviews.reduce((sum, review) => sum + review.rating, 0);
    movie.averageRating = movie.reviews.length ? totalRating / movie.reviews.length : 0;

    await movie.save();
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// API endpoint to delete a movie
app.delete('/movies/:id', async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.json({ message: 'Movie deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});