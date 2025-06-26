// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';

const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Not authorized, no token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // decoded should have the user ID
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token failed' });
  }
};

export default protect;