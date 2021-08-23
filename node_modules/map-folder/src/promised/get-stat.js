const {stat} = require('fs');

module.exports = function getStat (entryPath) {
	return new Promise((resolve, reject) => {
		stat(entryPath, (err, statObj) => {
			if (err) reject(err);
			else resolve(statObj);
		});
	});
};
