const authenticateToken = (req, res, next) => {
  // Bypass token check
  req.user = { role: 'admin' }; // Set a default role for testing purposes
  next();
};

const authorizeRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.sendStatus(403);
    }
    next();
  };
};

module.exports = { authenticateToken, authorizeRole };