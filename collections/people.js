"use strict";

/*
 * People collection.
*/

const
	Base   = require('./base'),
	Person = require('../models/person');

var People = Base.Collection.extend({
	model : Person,
	base  : '/people'
});

module.exports = Base.collection('People', People);