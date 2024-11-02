const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

const authMiddleware = (req, res, next) => {
  // Get the token from the Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach decoded token info (e.g., userId, role) to request object

    next(); // Call the next middleware or route handler
  } catch (error) {
    console.error('Token Verification Error:', error.message);
    return res.status(403).json({ message: 'Invalid token.' });
  }
};

module.exports = authMiddleware;
