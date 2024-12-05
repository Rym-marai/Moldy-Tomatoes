const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  movieTitle: { type: String, required: true },
  rating: { type: Number, required: true },
  reviewId: { type: mongoose.Schema.Types.ObjectId, ref: 'Review', required: true },
});

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin', 'manager'], default: 'user' },
  mfaEnabled: { type: Boolean, default: false },
  mfaCode: { type: String },
  mfaCodeExpires: { type: Date },
  reviews: { type: [reviewSchema], default: [] },
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
