"use strict";

var App = require('../app');

var NewsletterController = {

	index: function(req, res, next) {
		res.render('newsletter/index');
	}

};

module.exports = App.controller('Newsletter', NewsletterController);
