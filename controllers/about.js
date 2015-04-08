"use strict";

var	fortune = require('../lib/fortune.js');

module.exports = {
	index: function(req, res, next) {
		res.render('about/index', {
			fortune: fortune.getFortune()
		});
	}
};