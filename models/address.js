"use strict";

const
	Base   = require('./base'),
	Person = require('./person');

var Address = Base.Model.extend({
	tableName: 'addresses',

	person: function() {
		return this.belongsTo(Person);
	}
});

module.exports = Base.model('Address', Address);
