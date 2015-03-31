#!/usr/bin/env node --harmony

'use strict';

const 
	fs   = require('fs'),
    path = require('path');

var dir = path.join(__dirname, 'models');

var myObj = {
	kokot: require('./models/base')
};

console.log(require('./models'));


