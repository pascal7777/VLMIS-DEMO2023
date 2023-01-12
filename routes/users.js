const express = require('express');
const router = express.Router();
const users = require('../controllers/users');
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');

router.get('/register', users.registrationForm)

router.post('/register', catchAsync(users.createRegistration))

router.get('/login', users.renderLogin)

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.makeLogin)

router.get('/logout', users.logout);


module.exports = router;