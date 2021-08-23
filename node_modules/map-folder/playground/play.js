/* eslint-disable */
const {mapFolderSync} = require('../');

const map = mapFolderSync('./test/dummy-folder', {
	exclude: ['.ignored', '.doc'],
	// skipEmpty: false,
});


// include: ['.js', '_index_only', 'public', {name: 'images', include: ['.png', '.jpg']}],

// const map = mapFolder.sync('./test/dummy-folder', {
// 	includeExt: ['csv', 'doc'],
// 	skipEmpty: false,
// });

console.log(map);
// map.then((res) => {
	// console.log(res);
// });

setTimeout(() => {}, 20000);
