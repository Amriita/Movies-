const mapFolder = require('map-folder');

const hasIndex = entries => Boolean(entries['index.js']);
const hasFileWithSameName = (entries, name) => Boolean(entries[name + '.js']);

function requireFolder (dirPath, opts = {}) {
	const includeList = new Set(opts.include || []);
	const excludeList = opts.exclude || [];

	const dirMap = mapFolder(dirPath, {
		include: ['.js', ...includeList],
		exclude: excludeList
	});

	opts.mapKey = typeof opts.mapKey == 'function' ? opts.mapKey : null;

	const groupsMap = createGroupsMap(opts.group || opts.groups);
	const hooks = opts.hooks || Object.create(null);
	const {isFile, entries} = dirMap;

	if (isFile || hasIndex(entries)) return require(dirMap.path);

	const obj = Object.create(null);

	forIn(entries, (mapKey, entryMap) => {
		const key = resolveKey(entryMap, opts);
		if (!entryMap.isFile && hasFileWithSameName(entries, key)) return;

		if (includeList && includeList.has(entryMap.name)) {
			obj[key] = entryMap;
		}
		else if (groupsMap && groupsMap.has(key)) {
			const groupName = groupsMap.get(key);

			obj[groupName] = obj[groupName] || Object.create(null);
			obj[groupName][key] = requireFolder(entryMap.path, opts);
		}
		else {
			const requiredModule = requireFolder(entryMap.path, opts);
			const hook = hooks[key];

			if (hook) hook(requiredModule, obj, entryMap);
			else obj[key] = requiredModule;
		}
	});

	return obj;
}

module.exports = requireFolder;

function resolveKey (map, opts) {
	const  {
		mapKey: keyMapper,
		camelCase,
		normalizeKeys
	} = opts;

	const rawKey = (map.isFile) ? map.base : map.name;

	const key = camelCase
		? convertToCamelCase(rawKey)
		: normalizeKeys
			? normalizeKey(rawKey)
			: rawKey
	;

	return keyMapper ? keyMapper(key) : key;
}

const UNDERSCORE = '_';
const DASHES_UNDERSCORES_SPACES = /(-|_|\s)+/ug;
const NOT_WORD_CHAR_NOR_UNDERSCORE = /\W+|_+/u;

function normalizeKey (rawKey) {
	return rawKey.replace(DASHES_UNDERSCORES_SPACES, UNDERSCORE);
}

function convertToCamelCase (str) {
	return str
		.split(NOT_WORD_CHAR_NOR_UNDERSCORE)
		.map((word, i) => (i === 0 ? word.toLowerCase() : convertToTitle(word)))
		.join('')
	;
}

function convertToTitle (str) {
	str = str.toLowerCase();
	const upperFirstChar = str[0].toUpperCase();
	return upperFirstChar + str.substr(1);
}

function createGroupsMap (rawGroups) {
	if (!rawGroups) return null;

	return flipFlatObjToMap(rawGroups);
}

/*
	Turns an object with string/array values
	into a map of {value: key}.

	Flips: reversing key:value => value:key
	Flattens: key: [val1, val2, valu3] => val1=key, val2=key, val3=key

	Example:

	aliases = {
		nba: ['NBA', 'N.B.A.']
	}

	Becomes:

	aliasesMap = {
		'NBA'  : 'nba',
		'N.B.A': 'nba',
	}
*/
function flipFlatObjToMap (obj) {
	const map = new Map();

	forIn(obj, (key, value) => {
		if (typeof value == 'string') {
			map.set(value, key);
		}
		else if (Array.isArray(value)) {
			value.forEach((item) => {
				map.set(item, key);
			});
		}
	});

	return map;
}

function forIn (obj, fn) {
	const keys = Object.keys(obj);
	let index = keys.length - 1;

	while (index >= 0) {
		const key = keys[index];
		fn.call(obj, key, obj[key]);
		index -= 1;
	}
}
