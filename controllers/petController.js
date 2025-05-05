const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Pet = require('../models/Pet');

// Show form to add a new pet
router.get = (req, res) => {
    res.render('pets/new', { title: 'Add New Pet' });
  };
  
  // Handle new pet submission
  router.post = async (req, res) => {
    try {
      const newPet = new Pet({
        name: req.body.name,
        species: req.body.species,
        breed: req.body.breed,
        age: req.body.age,
        user: req.session.user._id
      });
  
      await newPet.save();
      res.redirect('/pets');
    } catch (err) {
      console.error(err);
      res.redirect('/pets');
    }
  };
  
  // Show all pets for the logged-in user
  router.get = async (req, res) => {
    try {
      const pets = await Pet.find({ user: req.session.user._id });
      res.render('pets/index', { title: 'My Pets', pets });
    } catch (err) {
      console.error(err);
      res.redirect('/');
    }
  };
  module.exports = router;
  