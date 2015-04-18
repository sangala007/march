'use strict';

module.exports = function(config) {
	const
		express          = require('express'),
		cluster          = require('cluster'),
	  	flash            = require('express-flash'),
  		logger           = require('morgan'),
		bodyParser       = require('body-parser'),
		cookieParser     = require('cookie-parser'),
		session          = require('express-session'),
		csrf             = require('lusca').csrf(),
	  	hbs              = require('hbs'),
	    path             = require('path'),
	    passport         = require('passport'),
		_                = require('lodash'),
		expressValidator = require('express-validator'),
		MongoStore       = require('connect-mongo')(session);

	/*
	* Create Express server.
	*/
	var server = express();

	/*
	* Express configuration.
	*/
	var csrfWhitelist = []; //config.site.csrfWhitelist;

	// Port
	server.set('port', config.port);

	// Define views folder
	server.set('views', path.join(__dirname, 'views'));

	/*
	* Handlebars settings
	*/
  	server.engine('hbs', hbs.__express);
	server.set('view engine', 'hbs');
	server.set('view options', { layout: 'layouts/default' });
	server.disable('view cache');

	hbs.localsAsTemplateData(server);
	hbs.registerPartials(path.join(__dirname,'views', 'partials'));

	// Parse cookies
	server.use(cookieParser(config.cookieSecret));

	// Session management.
	server.use(session({
		secret : config.cookieSecret,
		store  : new MongoStore({
	    	host          : 'localhost', 
	    	port          : 27017, 
	    	db            : 'mydb',
			autoReconnect : true
		}),
		resave            : true,
		saveUninitialized : true
	}));

	// Login management
	server.use(passport.initialize());
	server.use(passport.session());

	// Forms
	server.use(bodyParser.json());
	server.use(bodyParser.urlencoded({ extended: true }));

	// Input validation
	server.use(expressValidator());

	// Message display
	server.use(flash());

	// Serve static files
	server.use(express.static( path.join(__dirname, 'public') ));

	// Logging
	server.use(logger('dev'));

	// Log worker id with each request.
	server.use(function(req, res, next) {
		if (cluster.isWorker) {
			console.log('Worker %d received request', cluster.worker.id);
		}
		next();
	});

	// CSRF protection.
	server.use(function(req, res, next) {
		if (_.contains(csrfWhitelist, req.path)) {
			return next();
		}
		csrf(req, res, next);
	});

	// Make user object available in templates.
	server.use(function(req, res, next) {
		if (req.user) {
		  res.locals.user    = req.user.toJSON();
		  req.session.userid = req.user.get('id');
		}

		res.locals.sessionHistory = req.session.history;
		res.locals.base = 'http://' + req.headers.host;

		next();
	});

	return server;
};
