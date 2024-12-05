const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth'); // Import auth routes
const movieRoutes = require('./routes/movies'); // Import movie routes
const reviewRoutes = require('./routes/reviews'); // Import review routes
const adminRoutes = require('./routes/admin'); // Import admin routes
const config = require('./config'); // Import the configuration file

const app = express();
const port = config.port;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(config.mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Use auth routes
app.use('/auth', authRoutes);

// Use movie routes
app.use('/movies', movieRoutes);

// Use review routes
app.use('/reviews', reviewRoutes);

// Use admin routes
app.use('/admin', adminRoutes);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});