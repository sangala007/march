"use strict";

const
	crypto   = require('crypto'),
    mode     = 'aes-256-ctr',
    password = 'cherry',
    size     = 15;

module.exports = {

	encrypt: function(text) {
		var cipher  = crypto.createCipher(mode, password);
		var crypted = cipher.update(text, 'utf8', 'hex');

		crypted += cipher.final('hex');
		return crypted;
	},

	decrypt: function(text) {
		var decipher = crypto.createDecipher(mode, password);
		var dec = decipher.update(text,'hex','utf8');

		dec += decipher.final('utf8');
		return dec;
	},

	toBase64: function(str) {
		return new Buffer(str).toString('base64');
	},

	fromBase64: function (str) {
		return new Buffer(str, 'base64').toString('ascii');
	},

	add_padding: function(str) {
		let 
			buffer = '',
			limit  = size - String(str).length;

		for (var i = 0; i < limit; i++) {
			buffer += '0';
		};
		return buffer+str;
	},

	// Generate unique token for the system from record id.
	toSUID: function(id) {
		let
			padded    = this.add_padding(id),
			encrypted = this.encrypt(padded);
			encoded   = this.toBase64(encrypted);
		return encoded;
	},

	fromSUID: function(str) {
		let 
			decoded   = this.fromBase64(str),
			decrepted = this.decrypt(decoded),
			unpadded  = parseInt(decrepted, 10);
		return unpadded;		
	}

};





