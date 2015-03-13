"use strict";

// Login Required middleware.
exports.isAuthenticated = function (req, res, next) {
	return next();

	// if (req.isAuthenticated()) {
	// 	return next();
	// }
  
	// res.redirect('/login');
};