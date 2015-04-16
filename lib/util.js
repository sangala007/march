
// Generate unique token for the system.
exports.generateSUID = function () {
	return Math.floor(Math.random() * new Date());
};