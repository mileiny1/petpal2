// Importing required modules
const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');
const path = require('path'); 
// calling the controllers and middleware or import the files

const authController = require('./controllers/authController.js');
const appoitmentController = require('./controllers/appoitmentController.js');
const petController = require('./controllers/pet.js');
const vetVisitController = require('./controllers/vetVisit.js');
const isSignedIn = require('./middleware/is-signed-in');
const passUserToView = require('./middleware/pass-user-to-view');

// connection for the database and port
const port = process.env.PORT ? process.env.PORT : '3000';
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
  });


  //view engine for ejs
app.set('view engine', 'ejs');

// public folder for stylesheets and images
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse URL-encoded data from forms
app.use(express.urlencoded({ extended: false }));
// Middleware for using HTTP verbs such as PUT or DELETE
app.use(methodOverride("_method"));


// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
 // app.use(morgan('dev'));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// route for auth c.
app.use("/auth", (req, res, next) => {
  authController(req, res, next);
});


// route for appoitment controller
app.use("/appoitment", (req, res, next) => {
    appoitmentController(req, res, next);
  });

  // route for pet controller
  app.use("/pet", (req, res, next) => {
    petController(req, res, next);
  });
  
  // route for vet visit
  app.use("/vetvisit", (req, res, next) => {
    vetVisitController(req, res, next);
  });






  //server connection port
app.listen(port, () => {
    console.log(`The express app is ready on port ${port}!`);
  });