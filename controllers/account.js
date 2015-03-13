"use strict";

const
	App      = require('../app'),
	Person   = require('../models/person'),
	passport = require('passport');

var AccountController = {

	/*
	* GET: /login
	*/
	login: function(req, res, next) {
		res.render('account/login', {
			title: 'Log In',
			description: 'NodeZA log in page',
			page: 'login'
		});
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

				res.redirect(req.session.returnTo || '/');
			});
		})(req, res, next);
	},

	signup: function(req, res, next) {
		res.render('about/index', {
			fortune: fortune.getFortune()
		});
	},

	postSignup: function(req, res, next) {
		res.render('about/index', {
			fortune: fortune.getFortune()
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
		res.render('about/index', {
			fortune: fortune.getFortune()
		});
	}

};

module.exports = App.controller('Account', AccountController);
