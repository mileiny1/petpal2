const mongoose = require('mongoose');

const vetVisitSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the user who created the appointment
        required: true
    },
    pet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pet', // Reference to the Pet model
        required: true
    },
    vet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vet', // Reference to the Vet model
        required: true
    },
    date: {
        type: Date,  // Date of the appointment
        required: true
    },
    time: {
        type: String,  // Time of the appointment (can be a string like '10:00 AM')
        required: true
    },
    reason: {
        type: String,  // Reason for the appointment (e.g., "Routine checkup", "Vaccination", etc.)
        required: true
    },
    status: {
        type: String,  // Status of the appointment (e.g., "Scheduled", "Completed", "Cancelled")
        default: 'Scheduled',
    },
    notes: {
        type: String,  // Additional notes about the visit (e.g., treatments, follow-ups)
        default: ''
    }
}, {
    timestamps: true  // Automatically adds `createdAt` and `updatedAt` fields
});

// Create a model based on the schema
const VetVisit = mongoose.model('VetVisit', vetVisitSchema);

module.exports = VetVisit;
