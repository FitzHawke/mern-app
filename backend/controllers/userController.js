const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const passport = require('passport');
const User = require('../models/userModel');

//  @desc   Register New User
//  @route  POST /api/users
//  @access Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('please fill in all fields');
  }

  // Check for existing user
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('user already exists');
  }

  // hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(password, salt);

  // Create User
  const user = await User.create({
    name,
    email,
    password: hashedPass,
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('invalid user data');
  }
});

//  @desc   Authenticate a user
//  @route  POST /api/users/login
//  @access Public
const loginUser = asyncHandler(async (req, res, next) => {
  passport.authenticate(
    'local',
    { session: false },
    function (err, user, info) {
      if (err) {
        return next(err);
      }

      if (!user) {
        return res.status(500).json(info.message);
      }

      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    }
  )(req, res, next);
});

//  @desc   Get user data
//  @route  GET /api/users/me
//  @access Private
const getUserData = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

module.exports = { registerUser, loginUser, getUserData };
