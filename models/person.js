"use strict";

const
	Base    = require('./base'),
	Address = require('./address');

var Person = Base.Model.extend({
	tableName: 'people',

	addresses: function() {
		return this.hasMany(Address);
	}
});

module.exports = Base.model('Person', Person);