"use strict";

var App     = require('../app');
var	fortune = require('../lib/fortune.js');

var AboutController = {

	index: function(req, res, next) {
		res.render('about/index', {
			fortune: fortune.getFortune()
		});
	}

};

module.exports = App.controller('About', AboutController);