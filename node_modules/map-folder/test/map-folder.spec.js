/* eslint-disable max-lines-per-function */

const {unlink, writeFile} = require('fs');
const {expect} = require('chai');

const mapFolder = require('../');
const getTestFolderPath = require('./expected-results/get-test-folder-path');

describe('map-folder\n  ──────────', () => {
	const gitkeepPath = getTestFolderPath('/notes/empty/.gitkeep');

	before((done) => {
		unlink(gitkeepPath, (err) => {
			if (err && !err.message.includes('ENOENT: no such file or directory')) throw err;
			done();
		});
	});

	after((done) => {
		writeFile(gitkeepPath, '', (err) => {
			if (err) throw err;
			done();
		});
	});

	it('exports a function', () => {
		expect(mapFolder).to.be.a('function');
	});

	describe('Errors', require('./test-map-folder-errors'));
	describe('sync', require('./test-map-folder-sync'));
	describe('async', require('./test-map-folder-async'));
});
