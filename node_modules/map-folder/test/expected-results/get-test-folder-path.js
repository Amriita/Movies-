const {resolve} = require('path');

module.exports = function getTestFolderPath (dummyPath = '') {
	return resolve(`test/dummy-folder/${dummyPath}`);
};
