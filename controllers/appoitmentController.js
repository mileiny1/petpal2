const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appoitment');
const Pet = require('../models/Pet');

// GET all appointments
router.get('/', async (req, res) => {
    try {
        // Look up all appointments
        const appoitments = await Appoitment.find().populate('user pet vet');

        res.render('appoitment/index.ejs', {
            title: "All Appoitments with the Vet",
            appointments
        });
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

// POST - Create a new appointment
router.post('/', async (req, res) => {
    try {
        const newAppointment = new Appoitment({
            user: req.session.user._id, // Assuming user is logged in
            date: req.body.date,
            time: req.body.time,
            reason: req.body.reason,
            vet: req.body.vet, // Ensure vet ID is sent in form
            pet: req.body.pet  // Ensure pet ID is sent in form
        });

        await newAppointment.save();
        res.redirect('/appoitment');
    } catch (error) {
        console.log(error);
        res.redirect('/appoitment');
    }
});

module.exports = router;


