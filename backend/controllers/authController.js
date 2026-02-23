const Company = require('../models/companyModel');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// POST /api/auth/signup
const signup = async (req, res, next) => {
  try {
    const { companyName, email, password } = req.body;

    const existing = await Company.findOne({ email });
    if (existing) {
      res.status(400);
      throw new Error('A company with this email already exists');
    }

    const company = await Company.create({ companyName, email, password });

    res.status(201).json({
      success: true,
      token: generateToken(company._id),
      company: {
        id: company._id,
        companyName: company.companyName,
        email: company.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const company = await Company.findOne({ email });
    if (!company || !(await company.matchPassword(password))) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    res.status(200).json({
      success: true,
      token: generateToken(company._id),
      company: {
        id: company._id,
        companyName: company.companyName,
        email: company.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { signup, login };