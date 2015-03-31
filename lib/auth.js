"use strict";

const
	_             = require('lodash'),
	passport      = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	Person        = require('../models/person');

passport.serializeUser(function(person, done) {
	done(null, person.get('id'));
});

passport.deserializeUser(function(id, done) {
	Person.forge({id: id}).fetch().then(function(person) {
		done(false, person);

	}).otherwise(function (error) {
		done(error);
	});
});

// Sign in using Email and Password.
passport.use(new LocalStrategy({ usernameField: 'email' }, 
	function(email, password, done) {
		Person.forge({email: email})
		.fetch()
		.then(function(person) {
			if (!person) {
				return done(null, false, {message: 'Email ' + email + ' not found'});
			}

			person.comparePassword(password)
			.then(function(isMatch) {
				if (isMatch) {
					done(null, person);

				} else {
					done(null, false, { message: 'Invalid password.' });
				}

			}).otherwise(function () {
				done(null, false, { message: 'Invalid password.' });
			});

		}).otherwise(function (err) {
			console.log(err);
			done(null, false, {message: 'Database error!'});
		});
	}
));

// Login Required middleware.
exports.isAuthenticated = function (req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login');
};

exports.isNotAuthenticated = function (req, res, next) {
	if (!req.isAuthenticated()) {
		return next();
	}

	res.redirect('/');
};