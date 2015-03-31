#!/usr/bin/env node --harmony

'use strict';

const
	EventEmitter = require('events').EventEmitter,
	_            = require('lodash'),
	path         = require('path'),
	fs           = require('fs'),
	config       = require('./config'),
	Bookshelf    = require('./dbconnect')(config),
	errorHandler = require('errorhandler'),
	express      = require('./server');

var emitter     = new EventEmitter();
var Cache       = {};
var Controllers = {};

var models;
var collections;
var controllers;
var routes;
var widget;

// Flag to check if app is already running.
var appIsRunning = false;

/*
 * Loads application resources
*/
function loadAppModules() {
	models      = require('./models');
	collections = require('./collections');
	controllers = require('./controllers');
	routes      = require('./routes');

	return {
		models      : models,
	    collections : collections,
		controllers : controllers,
		routes      : routes,
	};
}

/*
 * Sets up route by matching routes to their controllers.
*/
function setupRoutes(App, routes, controllers) {
	_.keys(routes).forEach(function(route) {
		// Call routes with their corresponding controllers.
		routes[route](App, controllers[route]);
	});

	// Add custom 404 page.
	App.use(function(req, res) {
		res.status(404);
		res.render('404');
	});

	// Error handling.
	switch(App.get('env')) {
		case 'production':
			App.use(function(err, req, res, next) {
				res.status(500);
				res.render('500');
			});
			break;

		default:
			App.use(errorHandler());
			break;
	}
}

var App = {

	bookshelf: Bookshelf,

	// Before creating a new route check if it already exists.
	routesBlacklist: [],

	use: function() {
		var args = _.toArray(arguments);
		this.server.use.apply(this.server, args);		
	},

	/*
	* Override express GET method so we can spy on the routes passed.
	*/
	get: function() {
		var args = _.toArray(arguments);
		var routeString = args[0];

		this.routesBlacklist.push(routeString);
		this.server.get.apply(this.server, args);
	},

	/*
	* Override express POST method so we can spy on the routes passed.
	**/
	post: function() {
		var args = _.toArray(arguments);
		var routeString = args[0];

		this.routesBlacklist.push(routeString);
		this.server.post.apply(this.server, args);
	},

	/*
	* Application events handler.
	*/
	on: function() {
		emitter.on.apply(this, _.toArray(arguments));
	},

	/*
	* Application event dispatcher.
	*/
	emit: function() {
		emitter.emit.apply(this, _.toArray(arguments));
	},

	/*
	* Routes middleware for checking permissions.
	*/
	hasPermission: function (role) {
		return function (req, res, next) {
			// if user is logged in and has permission or if no role is defined
			if (!role.get('id')) {
				next();

			} else if (req.user.related('role').get('name') === 'Super Administrator') {
				next();

			} else if ((req.user && req.user.related('role').get('id') === role.get('id'))) {
				next();

			} else {
				req.flash('errors', { msg: 'You are not authorized!' });
				res.redirect('back');
			}
		};
	},

	/*
	* Fetches a model.
	*/
	getModel: function (name, options) {
		if (Bookshelf._models[name]) {
			return new Bookshelf._models[name](options);
		}
	},

	/*
	* Fetches a collection.
	*/
	getCollection: function (name, options) {
		if (Bookshelf._collections[name]) {
			return new Bookshelf._collections[name](options);
		}
	},

	/*
	* Fetches a controller method.
	*/
	getController: function (name, method) {
		if (Controllers[name] && _.isFunction(Controllers[name][method])) {
			return Controllers[name][method];
		}

		return function(){};
	},

	/*
	* Fetches a cached item.
	*/
	getCache: function (name) {
		return Cache[name];
	},

	/*
	* Caches an item
	*/
	setCache: function (name, val) {
		Cache[name] = val;
	},

	/*
	* checks if an item is cached
	*/
	cacheExists: function (name) {
		return !!Cache[name];
	},

	/*
	* Clears application cache.
	*/
	clearCache: function () {
		_.each(Cache, function (value, key) {
			Cache[key] = null;
		});

		console.log('Cache cleared. Process ID: %s', process.pid);
	},

	/*
	* Stores a controller Object Bookshelf.registry style.
	*/
	controller: function (name, val) {
		Controllers[name] = val;

		return val;
	},

	/*
	* Checks if a controller and method exists.
	*/
	hasController: function (name, method) {
		return !!Controllers[name] && _.isFunction(Controllers[name][method]);
	},

	/*
	* Fetches a controller with all its method names.
	*/
	getControllers: function () {
		return _.keys(Controllers).map(function (val) {
			return {
				name: val,
				methods: _.keys(Controllers[val])
			};
		});
	},

	/*
	* Initialize the application
	*/
	init: function (port) {
		// prevent re-initialization of the app
		if (appIsRunning) {
			return false;
		}

		var self = this;
		var server;

		// Load modules
		var modules = loadAppModules();

		// Create express server.
		server = self.server = express(config);

		// Make current user accessible from applicaction object.
		server.use(function(req, res, next) {
			if (req.user) self.user = req.user;

			if (req.session.clearCache) {
				self.clearCache();
				req.session.clearCache = null;
			}

			next();
		});

		// Sets up route by matching routes to their controllers.
	    setupRoutes(self, modules.routes, modules.controllers);

		// start server
		server.listen(port || server.get('port'), server.get('ipAddress'), function() {
			console.log("✔ Server listening on port %d in %s mode", port || server.get('port'), server.get('env'));

			appIsRunning = true;
		});
	}
};

module.exports = App;
