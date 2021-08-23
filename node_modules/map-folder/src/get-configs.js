const TRUTHY_VALUES = thing => thing;

// eslint-disable-next-line max-statements, max-lines-per-function
module.exports = function getConfigs (opts) {
	if (opts && opts.isConfigured) return opts;

	let rawExclude = null;
	let rawInclude = null;
	let excludeNames = null;
	let excludeExtensions = null;
	let includeNames = null;
	let includeExtensions = null;
	let foldersOptsMap = null;
	let filter = null;
	let skipEmpty = false;
	let async = false;

	if (opts && typeof opts == 'object') {
		rawExclude = opts.exclude || null;
		rawInclude = opts.include || null;
		filter = opts.filter || null;
		skipEmpty = opts.skipEmpty || skipEmpty;
		async = opts.async == null ? async : opts.async;

		if (rawInclude) {
			[
				includeNames,
				includeExtensions,
				foldersOptsMap
			] = parseInclude(rawInclude);

			skipEmpty = opts.skipEmpty == null ? true : skipEmpty;
		}

		if (rawExclude) {
			[
				excludeNames,
				excludeExtensions
			] = parseExclude(rawExclude);
		}

		if (filter && typeof filter != 'function') {
			throw new Error('map-folder: `filter` must be a function.');
		}
	}

	return {
		async,
		filter,
		skipEmpty,
		excludeNames,
		excludeExtensions,
		includeNames,
		includeExtensions,
		includeFolders: foldersOptsMap,
		isConfigured: true,
	};
};

function parseInclude (rawInclude) {
	validateIsArray('include', rawInclude);
	const cleanInclude = rawInclude.filter(TRUTHY_VALUES);
	validateInclude(cleanInclude);

	return separateNamesAndExtensions(cleanInclude);
}

function parseExclude (rawExclude) {
	validateIsArray('exclude', rawExclude);
	const cleanExclude = rawExclude.filter(TRUTHY_VALUES);
	validateExclude(cleanExclude);

	return separateNamesAndExtensions(cleanExclude);
}

function validateIsArray (optName, optValue) {
	if (!Array.isArray(optValue)) {
		throw new Error(`map-folder: \`${optName}\` option must be an array.`);
	}
}

function validateExclude (rawExclude) {
	rawExclude.forEach((item) => {
		if (!item || typeof item != 'string') {
			throw new Error('map-folder: `exclude` array should be an array of strings only.');
		}
	});
}

function validateInclude (rawInclude) {
	rawInclude.forEach((item) => {
		if (!item || (typeof item != 'string' && (typeof item != 'object' || !item.name))) {
			throw new Error('map-folder: `include` option must be an array of strings or objects. Objects must have a `name` property');
		}
	});
}

function separateNamesAndExtensions (rawArray) {
	let entryNames = [];
	let extensions = [];
	let foldersOpts = new Map();

	rawArray.forEach((item) => {
		if (typeof item == 'string') {
			item = item.toLowerCase();
		}
		else {
			foldersOpts.set(item.name, item);
			item = item.name;
		}

		if (item.startsWith('.')) extensions.push(item.substr(1));
		else entryNames.push(item);
	});

	if (!entryNames.length) entryNames = null;
	if (!extensions.length) extensions = null;
	if (!foldersOpts.size) foldersOpts = null;

	return [entryNames, extensions, foldersOpts];
}
