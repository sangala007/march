"use strict";

module.exports = function(app, AboutController) {
	app.get('/about', AboutController.index);
};