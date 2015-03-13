"use strict";

// Middleware to check if user is recognized.
var auth = require('../lib/auth');

module.exports = function (app, AccountController) {
  app.get('/login', auth.isAuthenticated, AccountController.login);
  app.post('/login', auth.isAuthenticated, AccountController.postLogin);
  app.get('/signup', auth.isAuthenticated, AccountController.signup);
  app.post('/signup', auth.isAuthenticated, AccountController.postSignup);
  app.get('/forgot', auth.isAuthenticated, AccountController.forgot);
  app.post('/forgot', auth.isAuthenticated, AccountController.postForgot);
  app.get('/logout', auth.isAuthenticated, AccountController.logout);
};