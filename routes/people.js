"use strict";

module.exports = function(app, PeopleController) {
	app.get('/people', PeopleController.index);
};