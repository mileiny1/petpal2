const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user.js');

// Show sign-up page
router.get('/sign-up', (req, res) => {
  res.render('auth/sign-up.ejs', {
    title: "Sign Up"
  });
});

// Show sign-in page
router.get('/sign-in', (req, res) => {
  res.render('auth/sign-in.ejs', {
    title: "Sign In"
  });
});

// Log out
router.get('/sign-out', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

// Handle sign-up
router.post('/sign-up', async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  try {
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.send('Username is already taken.');
    }

    if (password !== confirmPassword) {
      return res.send('Password and Confirm Password must match');
    }


    // hash password to send to the data base

    const hashedPassword = await bcrypt.hash(password, 10);
    req.body.password = hashedPassword;

    // this is for create new users
    
    await User.create({
      username,
      email,
      password: hashedPassword
    });

    // After registration, redirect to login
    res.redirect('/auth/sign-in');
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
});

// Handle sign-in
router.post('/sign-in', async (req, res) => {
  const { username, password } = req.body;

  try {
    const userInDatabase = await User.findOne({ username });

    if (!userInDatabase) {
      return res.send('Login failed. User not found.');
    }

    const isPasswordValid = await bcrypt.compare(password, userInDatabase.password);

    if (!isPasswordValid) {
      return res.send('Login failed. Incorrect password.');
    }

    // Create user session
    req.session.user = {
      _id: userInDatabase._id,
      username: userInDatabase.username
    };

    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
});

module.exports = router;