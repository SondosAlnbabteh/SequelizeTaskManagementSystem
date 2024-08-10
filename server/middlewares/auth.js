const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, 'wesam123456789');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed' });
  }

};

module.exports = auth;