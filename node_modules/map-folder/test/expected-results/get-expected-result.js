const getFullExpectedResult = require('./get-full-expected-result');

const resultMappers = {
	file: exp => exp.entries['article.doc'],
	folderWithFiles: exp => exp.entries.diary,
	fullStructure: exp => exp,
	filter: (exp) => {
		delete exp.entries.notes.entries['wish-list.txt'];
		delete exp.entries.code.entries.images.entries['photo.jpg'];
		delete exp.entries.code.entries['index.html'];
		return exp;
	},
	filterAfter: (exp) => {
		delete exp.entries.notes.entries['wish-list.txt'];
		delete exp.entries.code.entries.images.entries['photo.jpg'];
		delete exp.entries.code.entries['index.html'];
		return exp;
	},
	skipEmpty: (exp) => {
		exp.entries.code.entries.images.entries = {};
		exp.entries.code.entries = {images: exp.entries.code.entries.images};
		exp.entries.diary.entries = {};
		exp.entries.notes.entries.empty.entries = {};
		delete exp.entries.notes.entries.personal.entries['goals.txt'];
		delete exp.entries.notes.entries['wish-list.txt'];
		return exp;
	},
	excludeEntryNames: (exp) => {
		delete exp.entries.notes.entries.personal;
		delete exp.entries.diary.entries['day-2.txt'];
		return exp;
	},
	excludeExtensions: (exp) => {
		delete exp.entries['article.doc'];
		delete exp.entries.notes.entries.personal.entries['contacts.csv'];
		return exp;
	},
	includeExtensions: (exp) => {
		delete exp.entries.code;
		delete exp.entries.diary;
		delete exp.entries.notes.entries.empty;
		delete exp.entries.notes.entries.personal.entries['goals.txt'];
		delete exp.entries.notes.entries['wish-list.txt'];
		return exp;
	},
	includeFiles: (exp) => {
		delete exp.entries.code.entries.images;
		delete exp.entries.code.entries.FLAG;
		delete exp.entries.code.entries['app.js'];
		delete exp.entries.code.entries['index.html'];
		delete exp.entries.code.entries['style.css'];
		delete exp.entries.code.entries['.dotfile'];
		delete exp.entries.diary.entries['day-1.txt'];
		delete exp.entries.notes;
		delete exp.entries['article.doc'];
		return exp;
	},
	includeExtensionsAndFiles: (exp) => {
		delete exp.entries.code;
		delete exp.entries.diary.entries['day-1.txt'];
		delete exp.entries.notes.entries.empty;
		delete exp.entries.notes.entries.personal.entries['goals.txt'];
		delete exp.entries.notes.entries['wish-list.txt'];
		return exp;
	},
	extensionsAndWholeFolder: (exp) => {
		delete exp.entries.notes.entries.empty;
		delete exp.entries.notes.entries.personal.entries['contacts.csv'];
		delete exp.entries['article.doc'];
		return exp;
	},
	folderWithOptions: (exp) => {
		delete exp.entries.code.entries.images;
		delete exp.entries.code.entries.FLAG;
		delete exp.entries.code.entries['app.js'];
		delete exp.entries.code.entries['.dotfile'];
		delete exp.entries.code.entries['style.css'];
		delete exp.entries.notes.entries.empty;
		delete exp.entries.notes.entries.personal.entries['contacts.csv'];
		delete exp.entries['article.doc'];
		return exp;
	},
};

module.exports = function getExpectedResult (testName) {
	const fullExpectedResult = getFullExpectedResult();

	return resultMappers[testName](fullExpectedResult);
};
