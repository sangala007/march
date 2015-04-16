"use strict";

// Middleware to check if user is recognized.
var auth = require('../lib/auth');

module.exports = function(app) {
	var DevicesController = app.controllers.devices;

	app.get('/devices/create', auth.isFromCrow, DevicesController.create);
	app.post('/devices/create', auth.isFromCrow, DevicesController.postCreate);
};

