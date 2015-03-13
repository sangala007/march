"use strict";

/*
 * Addresses collection.
*/

const
	Base    = require('./base'),
	Address = require('../models/address');

var Addresses = Base.Collection.extend({
	model : Address
});

module.exports = Base.collection('Addresses', Addresses);