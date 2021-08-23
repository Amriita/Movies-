const {readdir} = require('fs');

module.exports = function readDir (dirPath) {
	return new Promise((resolve, reject) => {
		readdir(dirPath, (err, entries) => {
			if (err) reject(err);
			else resolve(entries);
		});
	});
};
