/* eslint-disable max-lines-per-function */
const {expect} = require('chai');

const mapFolder = require('..');

module.exports = () => {
	it('throws when filter is not a function', () => {
		try {
			mapFolder('./', {
				filter: 'not a function',
			});
		}
		catch (ex) {
			return expect(ex.message).to.contain('`filter` must be a function');
		}

		return expect(false).to.be.true;
	});

	it('throws when `exclude` option is not an array', () => {
		try {
			mapFolder('./', {
				exclude: () => null,
			});
		}
		catch (ex) {
			return expect(ex.message).to.contain('map-folder: `exclude` option must be an array.');
		}

		return expect(false).to.be.true;
	});

	it('throws when `exclude` option is not an array of strings', () => {
		try {
			mapFolder('./', {
				exclude: [5],
			});
		}
		catch (ex) {
			return expect(ex.message).to.contain('map-folder: `exclude` array should be an array of strings only.');
		}

		return expect(false).to.be.true;
	});

	it('throws when `include` option is not an array', () => {
		try {
			mapFolder('./', {
				include: () => null,
			});
		}
		catch (ex) {
			return expect(ex.message).to.contain('map-folder: `include` option must be an array.');
		}

		return expect(false).to.be.true;
	});

	it('throws when `include` option is not an array of strings or objects with a `name` prop', () => {
		try {
			mapFolder('./', {
				include: [5],
			});
		}
		catch (ex) {
			return expect(ex.message).to.contain('map-folder: `include` option must be an array of strings or objects. Objects must have a `name` property');
		}

		return expect(false).to.be.true;
	});
};
