#!/usr/bin/env node --harmony

'use strict';

const
	cluster = require('cluster'),
	os      = require('os');

function startWorker() {
	var worker = cluster.fork();
	console.log('CLUSTER: Worker %d started', worker.id);
}

cluster.setupMaster({
	exec: 'index.js'
});

// Log any worker that disconnect. 
cluster.on('disconnect', function(worker) {
	console.log('CLUSTER: Worker %d disconnected from cluster', worker.id);
});

// When a worker dies, create a new one to replace it.
cluster.on('exit', function(worker, code, signal) {
	console.log('CLUSTER: Worker %d died with exit code %d (%s)', worker.id, code, signal);		
	startWorker();
});

// os.cpus().forEach(function() {
	startWorker();
// });
