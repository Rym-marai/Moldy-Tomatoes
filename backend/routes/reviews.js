const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const Review = require('../models/review'); // Ensure the correct import
const User = require('../models/User'); // Ensure the correct import
const axios = require('axios'); // Import axios for making HTTP requests

const router = express.Router();

// Add a new review
router.post('/', authenticateToken, async (req, res) => {
  const { movieTitle, rating, userId, recaptchaToken } = req.body;

  // Verify reCAPTCHA
  const secretKey = 'YOUR_NEW_RECAPTCHA_SECRET_KEY'; // Replace with your new reCAPTCHA secret key
  const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`;

  try {
    const response = await axios.post(verificationUrl);
    if (!response.data.success) {
      return res.status(400).json({ message: 'reCAPTCHA verification failed' });
    }

    // Check if the user has already reviewed this movie
    const existingReview = await Review.findOne({ movieTitle, userId });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this movie.' });
    }

    const review = new Review({ movieTitle, rating, userId }); // Use lowercase 'review' for the instance
    await review.save();

    // Update the user's reviews array
    const user = await User.findById(userId);
    if (user) {
      user.reviews.push({
        movieTitle: review.movieTitle,
        rating: review.rating,
        reviewId: review._id
      });
      await user.save();
    }

    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get reviews by movie title
router.get('/', authenticateToken, async (req, res) => {
  const { movieTitle } = req.query;
  try {
    const reviews = await Review.find({ movieTitle }).populate('userId', 'firstName lastName'); // Populate user details
    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length || 0;
    res.json({ reviews, averageRating });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a review
router.delete('/:id', authenticateToken, async (req, res) => {
  const reviewId = req.params.id;
  const userId = req.user._id; // Assuming user ID is available in the token

  try {
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'You are not authorized to delete this review' });
    }

    await review.remove();

    // Update the user's reviews array
    const user = await User.findById(userId);
    if (user) {
      user.reviews = user.reviews.filter(r => r.reviewId.toString() !== reviewId.toString());
      await user.save();
    }

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;