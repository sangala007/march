"use strict";

module.exports = function(app, NewsletterController) {
	app.get('/newsletter', NewsletterController.index);
};
