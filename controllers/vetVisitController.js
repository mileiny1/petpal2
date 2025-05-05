const express = require('express');
const router = express.Router();
const Appoitment = require('../models/Appoitment');
const Pet = require('../models/Pet');
const Vet = require('../models/Vet');  

// Get all vet visits for the logged-in user
router.get('/', async (req, res) => {
    try {
        const appointments = await Appointment.find({ user: req.session.user._id }).populate('pet vet');
        res.render('appointments/index.ejs', {
            title: 'My Vet Visits',
            appointments
        });
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

// Show form to create a new vet visit (appointment)
router.get('/new', async (req, res) => {
    try {
        // Fetch all pets and vets to populate the form
        const pets = await Pet.find({ user: req.session.user._id });
        const vets = await Vet.find();  // Assuming you have a Vet model

        res.render('appointments/new.ejs', {
            title: 'Schedule a New Vet Visit',
            pets,
            vets
        });
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

// Handle the creation of a new vet visit (appointment)
router.post('/', async (req, res) => {
    try {
        const { date, time, reason, pet, vet } = req.body;

        // Create a new appointment
        const newAppointment = new Appointment({
            user: req.session.user._id,
            date,
            time,
            reason,
            pet,  // Reference to the pet
            vet   // Reference to the vet
        });

        // Save the new appointment to the database
        await newAppointment.save();
        res.redirect('/appointments');
    } catch (error) {
        console.log(error);
        res.redirect('/appointments');
    }
});

// Show details of a specific vet visit (appointment)
router.get('/:id', async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id).populate('pet vet');
        if (!appointment) {
            return res.status(404).send('Appointment not found');
        }
        res.render('appointments/show.ejs', {
            title: `Appointment for ${appointment.pet.name}`,
            appointment
        });
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

// Show form to edit an existing appointment
router.get('/:id/edit', async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        const pets = await Pet.find({ user: req.session.user._id });
        const vets = await Vet.find();

        if (!appointment) {
            return res.status(404).send('Appointment not found');
        }

        res.render('appointments/add.ejs', {
            title: 'Edit Vet Visit',
            appointment,
            pets,
            vets
        });
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

// Handle updating an existing vet visit (appointment)
router.put('/:id', async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).send('Appointment not found');
        }

        // Update appointment details
        appointment.date = req.body.date;
        appointment.time = req.body.time;
        appointment.reason = req.body.reason;
        appointment.pet = req.body.pet;
        appointment.vet = req.body.vet;

        // Save updated appointment
        await appointment.save();
        res.redirect(`/appoitments/${appoitment._id}`);
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

// Delete a specific vet visit (appointment)
router.delete('/:id', async (req, res) => {
    try {
        const appoitment = await Appoitment.findByIdAndDelete(req.params.id);

        if (!appoitment) {
            return res.status(404).send('Appoitment not found');
        }

        res.redirect('/appoitments');
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

module.exports = router;
