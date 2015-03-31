"use strict";

var config = {
	production: {
		mode : 'production',
		port : 3000,
		db   : {
			client     : 'mysql',
			connection : {
				host     : 'localhost',
				user     : '', 
				password : '', 
				port     : 3306, 
				database : '',
				charset  : 'utf8'
			}
		},
		cookieSecret : '',
		mongodbUrl   : 'http://localhost:27017'
	},

	development: {
		mode : 'development',
		port : 3000,
		db   : {
			client     : 'mysql',
			connection : {
				host     : 'localhost',
				user     : '', 
				password : '', 
				port     : 3306, 
				database : '',
				charset  : 'utf8'
			}
		},
		cookieSecret : '',
		mongodbUrl   : 'http://localhost:27017'
	}
};

module.exports = config[process.env.NODE_ENV || 'development'];
