"use strict";

const
	App       = require('../app'),
	Bookshelf = App.bookshelf;

Bookshelf.Model = Bookshelf.Model.extend({

	initialize: function () {
		var self = this;

		self.on('saving', function (model, attributes, options) {
			return self.saving(model, attributes, options);
		});

		self.on('destroying', function (model, attributes, options) {
			self.destroying(model, attributes, options);
		});
	},

	getTableName: function () {
		return this.tableName;
	},

	getJSON: function (props) {
		var self = this;
		var json = {};

		props.forEach(function (prop) {
			json[prop] = self.get(prop);
		});

		return json;
	},


	saving: function (newObj, attr, options) {
		var self = this;
		var table = self.getTableName();

		// if only updating views field
		if (self.hasChanged('views') && !self.isNew() || self.hasChanged('resetPasswordToken')) {
			return;
		}

		// if user has no access to content
		if (!self.isNew() && !self.hasPermission()) {
			throw new Error('Access restricted');
		}

		// if new entry or updating, clear cache
		if (self.isNew() || !self.hasChanged('views')) {
			App.clearCache();
		}

		// if updating and has updated_by feild, set it to current user
		if (!self.isNew() && Databases[table].updated_by) {
			self.set('updated_by', App.user.get('id'));
		}
	},

	destroying: function () {
		var ownerId       = this.get('id');
		var currentUserId = App.user.get('id');
		var role          = App.user.related('role').get('name');

		// Super user cannot destroy own account
		if (!this.hasPermission() || (this.tableName === 'users' && ownerId === currentUserId && role === 'Super Administrator')) {
			throw new Error('You do not have permission to perform that action');
		}
	}
});

module.exports = Bookshelf;

