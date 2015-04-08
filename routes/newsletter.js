"use strict";

module.exports = function(app) {
	var NewsletterController = app.controllers.newsletter;

	app.get('/newsletter', NewsletterController.index);
};
