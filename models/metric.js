"use strict";

const
	Base   = require('./base'),
	System = require('./system'),
	Device = require('./device');

var Metric = Base.Model.extend({

	tableName: 'metrics',

	system: function() {
		return this.belongsTo(System);
	},

	device: function() {
		return this.belongsTo(Device);		
	}
});

module.exports = Base.model('Metric', Metric);