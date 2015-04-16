"use strict";

const
	passport = require('passport'),
	_        = require('lodash');

module.exports = {

	/*
	* GET: /devices/create
	*/
	create: function(req, res, next) {
		res.render('devices/create', {

		});
	},

	/*
	* POST: /devices/create
	*/
	postCreate: function(req, res, next) {
		req.assert('email', 'Email is not valid').isEmail();
		req.assert('password', 'Password must be at least 6 characters long').len(6);
		req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

		var errors = req.validationErrors();
		if (errors) {
			req.flash('errors', errors);
			return res.redirect('/');
		}

	}

}
