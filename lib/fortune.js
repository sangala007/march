var fortunes = [
	'Fortune 1',
	'Fortune 2',
	'Fortune 3',
	'Fortune 4',
	'Fortune 5'
];

exports.getFortune = function () {
	return fortunes[Math.floor(Math.random() * fortunes.length)];
};