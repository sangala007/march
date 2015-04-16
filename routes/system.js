"use strict";

// Middleware to check if user is recognized.
var auth = require('../lib/auth');

module.exports = function(app) {
	var SystemController = app.controllers.system;

	app.get('/system/create', [auth.isFromCrow, auth.isAuthenticated], SystemController.create);
	app.post('/system/create', [auth.isFromCrow, auth.isAuthenticated], SystemController.postCreate);

	app.get('/system/test', [auth.isFromCrow, auth.isAuthenticated], SystemController.test);
	app.post('/system/test', [auth.isFromCrow, auth.isAuthenticated], SystemController.postTest);
};
