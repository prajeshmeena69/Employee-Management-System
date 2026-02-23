const jwt = require('jsonwebtoken');
const Company = require('../models/companyModel');

const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      res.status(401);
      throw new Error('Not authorized. No token provided.');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.company = await Company.findById(decoded.id).select('-password');

    if (!req.company) {
      res.status(401);
      throw new Error('Company not found.');
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = protect;