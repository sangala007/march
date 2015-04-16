"use strict";

var config = {
	production: {
		mode : 'production',
		port : 9000,
		db   : {
			client     : 'mysql',
			connection : {
				host     : 'localhost',
				user     : 'node', 
				password : 'no1de2', 
				port     : 3306, 
				database : 'cherry',
				charset  : 'utf8'
			}
		},
		cookieSecret : '123456ASDFGH',
		mongodbUrl   : 'http://localhost:27017'
	},

	development: {
		mode : 'development',
		port : 9000,
		db   : {
			client     : 'mysql',
			connection : {
				host     : 'localhost',
				user     : 'node', 
				password : 'no1de2', 
				port     : 3306, 
				database : 'cherry',
				charset  : 'utf8'
			}
		},
		cookieSecret : '123456ASDFGH',
		mongodbUrl   : 'http://localhost:27017'
	}
};

module.exports = config[process.env.NODE_ENV || 'development'];
