const getTestFolderPath = require('./get-test-folder-path');

// eslint-disable-next-line max-lines-per-function
module.exports = function getFullExpectedResult () {
	return {
		name: 'dummy-folder',
		isFile: false,
		path: getTestFolderPath('/'),
		entries: {
			'article.doc': {
				name: 'article.doc',
				isFile: true,
				base: 'article',
				ext: 'doc',
				path: getTestFolderPath('/article.doc'),
			},
			notes: {
				name: 'notes',
				isFile: false,
				path: getTestFolderPath('/notes'),
				entries: {
					'wish-list.txt': {
						name: 'wish-list.txt',
						isFile: true,
						base: 'wish-list',
						ext: 'txt',
						path: getTestFolderPath('/notes/wish-list.txt'),
					},
					empty: {
						name: 'empty',
						isFile: false,
						path: getTestFolderPath('/notes/empty'),
						entries: {},
					},
					personal: {
						name: 'personal',
						isFile: false,
						path: getTestFolderPath('/notes/personal'),
						entries: {
							'contacts.csv': {
								name: 'contacts.csv',
								isFile: true,
								base: 'contacts',
								ext: 'csv',
								path: getTestFolderPath('/notes/personal/contacts.csv'),
							},
							'goals.txt': {
								name: 'goals.txt',
								isFile: true,
								base: 'goals',
								ext: 'txt',
								path: getTestFolderPath('/notes/personal/goals.txt'),
							},
						}
					}
				}
			},
			diary: {
				name: 'diary',
				isFile: false,
				path: getTestFolderPath('/diary'),
				entries: {
					'day-1.txt': {
						name: 'day-1.txt',
						isFile: true,
						base: 'day-1',
						ext: 'txt',
						path: getTestFolderPath('/diary/day-1.txt'),
					},
					'day-2.txt': {
						name: 'day-2.txt',
						isFile: true,
						base: 'day-2',
						ext: 'txt',
						path: getTestFolderPath('/diary/day-2.txt'),
					},
				}
			},
			code: {
				name: 'code',
				isFile: false,
				path: getTestFolderPath('/code'),
				entries: {
					'app.js': {
						name: 'app.js',
						isFile: true,
						base: 'app',
						ext: 'js',
						path: getTestFolderPath('/code/app.js'),
					},
					'app.min.js': {
						name: 'app.min.js',
						isFile: true,
						base: 'app.min',
						ext: 'js',
						path: getTestFolderPath('/code/app.min.js'),
					},
					'index.html': {
						name: 'index.html',
						isFile: true,
						base: 'index',
						ext: 'html',
						path: getTestFolderPath('/code/index.html'),
					},
					'style.css': {
						name: 'style.css',
						isFile: true,
						base: 'style',
						ext: 'css',
						path: getTestFolderPath('/code/style.css'),
					},
					'.dotfile': {
						name: '.dotfile',
						isFile: true,
						base: '',
						ext: 'dotfile',
						path: getTestFolderPath('/code/.dotfile'),
					},
					FLAG: {
						name: 'FLAG',
						isFile: true,
						base: 'FLAG',
						ext: '',
						path: getTestFolderPath('/code/FLAG'),
					},
					images: {
						name: 'images',
						isFile: false,
						path: getTestFolderPath('/code/images'),
						entries: {
							'logo.png': {
								name: 'logo.png',
								isFile: true,
								base: 'logo',
								ext: 'png',
								path: getTestFolderPath('/code/images/logo.png'),
							},
							'photo.jpg': {
								name: 'photo.jpg',
								isFile: true,
								base: 'photo',
								ext: 'jpg',
								path: getTestFolderPath('/code/images/photo.jpg'),
							},
						}
					},
				}
			}
		}
	};
};
