"use strict";

module.exports = function(app) {
	var AboutController = app.controllers.about;

	app.get('/about', AboutController.index);
};