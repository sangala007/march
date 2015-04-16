"use strict";

const
	Base       = require('./base'),
	SystemUser = require('./system_user');

var System = Base.Model.extend({

	tableName: 'systems',

	users: function() {
	    return this.hasMany(SystemUser);
	}

});

module.exports = Base.model('System', System);
