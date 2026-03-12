const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, 'your-secret-key', {
    expiresIn: '30d',
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, 'your-secret-key');
};

module.exports = {
  generateToken,
  verifyToken,
};