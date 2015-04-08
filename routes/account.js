"use strict";

// Middleware to check if user is recognized.
var auth = require('../lib/auth');

module.exports = function(app) {
	var AccountController = app.controllers.account;

	app.get('/login', auth.isNotAuthenticated, AccountController.login);
	app.post('/login', auth.isNotAuthenticated, AccountController.postLogin);
	app.get('/signup', auth.isNotAuthenticated, AccountController.signup);
	app.post('/signup', auth.isNotAuthenticated, AccountController.postSignup);
	app.get('/forgot', auth.isNotAuthenticated, AccountController.forgot);
	app.post('/forgot', auth.isNotAuthenticated, AccountController.postForgot);
	app.get('/logout', auth.isAuthenticated, AccountController.logout);
};