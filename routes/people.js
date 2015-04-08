"use strict";

module.exports = function(app) {
	var PeopleController = app.controllers.people;

	app.get('/people', PeopleController.index);
};