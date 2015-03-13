"use strict";

var App = require('../app');

var HomeController = {

	index: function(req, res, next) {
		res.cookie('kokot', 'ivan');
		res.cookie('signed_kokot', 'ivana', {signed: true});

		res.render('home/index', {
			pageTestScript: '/qa/tests-home.js'
		});
	},

	// Generate fake error.
	fail: function(req, res, next) {
		process.nextTick(function() {
			throw new Error('Fake Error being generated!');		
		});
	}
};

module.exports = App.controller('Home', HomeController);
