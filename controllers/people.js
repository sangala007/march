"use strict";

const
	Person = require('../models/person');

module.exports = {

	index: function(req, res, next) {
		new Person().fetchAll({
			debug: true,
			withRelated: ['addresses']

		}).then(function(people) {
			// res.status(200).json(people);
			res.render('people/index', {
				people: people.toJSON()
			});			

		}).otherwise(function(error) {
			req.flash('errors', {msg: error});
			res.redirect('/');
		});
	}
};



