const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  rating: { type: Number, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.models.Review || mongoose.model('Review', reviewSchema);