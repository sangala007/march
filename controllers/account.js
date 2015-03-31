"use strict";

const
	App      = require('../app'),
	Person   = require('../models/person'),
	passport = require('passport'),
	_        = require('lodash');

var AccountController = {

	/*
	* GET: /login
	*/
	login: function(req, res, next) {
		res.render('account/login');
	},

	/*
	* POST: /login
	*/
	postLogin: function(req, res, next) {
		req.assert('email', 'Email is not valid').isEmail();
		req.assert('password', 'Password cannot be blank').notEmpty();

		var errors = req.validationErrors();

		if (errors) {
			req.flash('errors', {msg: errors});
			return res.redirect('/login');
		}

		passport.authenticate('local', function(err, user, info) {
			if (err) { return next(err); }

			if (!user) {
				req.flash('errors', { msg: info.message });
				return res.redirect('/login');
			}

			req.logIn(user, function(err) {
				if (err) {
					req.flash('errors', { msg: err.message });
					res.redirect('/login');
				}

				req.flash('success', {msg: 'Welcome back!'});
				res.redirect(req.session.returnTo || '/');
			});
		})(req, res, next);
	},

	/*
	* GET: /signup
	*/
	signup: function(req, res, next) {
		res.render('account/signup');
	},

	/*
	* POST: /signup
	*/
	postSignup: function(req, res, next) {
		req.assert('email', 'Email is not valid').isEmail();
		req.assert('password', 'Password must be at least 6 characters long').len(6);
		req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

		var errors = req.validationErrors();
		if (errors) {
			req.flash('errors', errors);
			return res.redirect('/signup');
		}

		Person.forge({
			email    : req.body.email,
			username : req.body.username,
			password : req.body.password

		}).save().then(function(model) {
			req.flash('success', {msg: 'Success!'});

			req.logIn(model, function(err) {
				if (err) {
					return next(err);
				}

				res.redirect('/');
			});

		}).otherwise(function (error) {
			console.log(error);
			req.flash('errors', {'msg': error.message});
			res.redirect('/signup');
		});
	},

	forgot: function(req, res, next) {
		res.render('about/index', {
			fortune: fortune.getFortune()
		});
	},

	postForgot: function(req, res, next) {
		res.render('about/index', {
			fortune: fortune.getFortune()
		});
	},

	logout: function(req, res, next) {
	    req.logout();
		req.flash('success', {msg: 'You logged out!'});
	    res.redirect('/');
	}

};

module.exports = App.controller('Account', AccountController);
