#!/usr/bin/env node --harmony

'use strict';

const
	mysql  = require('mysql'),                   
	config = require('../config')('development');

var dbh = mysql.createConnection(config.db.connection);


/* 
* PEOPLE 
*/

dbh.query('DROP TABLE people');
dbh.query('\
CREATE TABLE people ( \
    id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT, \
    username VARCHAR(20) NOT NULL, \
    password CHAR(60) NOT NULL, \
        PRIMARY KEY (id), \
    UNIQUE INDEX id_UNIQUE (id ASC), \
    UNIQUE INDEX username_UNIQUE (username ASC) \
) ENGINE=InnoDB DEFAULT CHARSET=utf8');

/* 
* ADDRESSES
*/

dbh.query('DROP TABLE addresses');
dbh.query('\
CREATE TABLE addresses ( \
	id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT, \
	person_id INT(10) unsigned NOT NULL, \
    address_1 VARCHAR(255) NOT NULL, \
    address_2 VARCHAR(255) NULL, \
    city VARCHAR(255) NOT NULL, \
    state VARCHAR(255) NOT NULL, \
    zip VARCHAR(50) NOT NULL, \
    country VARCHAR(100) NOT NULL, \
        PRIMARY KEY (id), \
    KEY `person_id` (person_id) \
) ENGINE=InnoDB DEFAULT CHARSET=utf8');

console.log('DONE!')

dbh.end();