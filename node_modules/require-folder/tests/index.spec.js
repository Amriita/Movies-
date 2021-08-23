const {resolve} = require('path');
const {expect} = require('chai');

const requireFolder = require('../');

describe('requireFolder', () => {
	it('is a function', () => {
		expect(requireFolder).to.be.a('function');
	});

	it('shallow', () => {
		expect(requireFolder('./tests/dummy-folders/shallow')).to.deep.equal({
			a: 'aaa',
			b: 'bbb',
		});
	});

	it('prefers the file on duplicates', () => {
		expect(requireFolder('./tests/dummy-folders/duplicates')).to.deep.equal({
			a: 'aaa',
			b: 'bbb',
		});
	});

	it('requires `index.js` only - if exists', () => {
		expect(requireFolder('./tests/dummy-folders/index-only')).to.deep.equal({
			a: 'a-index',
			b: 'b-index',
			c: {
				c1: 'c1',
				c2: 'c2',
			}
		});
	});

	it('skips a lonely `index` property', () => {
		expect(requireFolder('./tests/dummy-folders/skip-index-prop')).to.deep.equal({
			aa: 'index',
			bb: {
				'not-index': 'not-index'
			},
		});
	});

	it('deep', () => {
		expect(requireFolder('./tests/dummy-folders/deep')).to.deep.equal({
			a: 'aaa',
			b: 'bbb',
			folder: {
				a: 'folder-a',
				b: 'folder-b',
			},
			'level-1': {
				a: 'level-1-a',
				b: 'level-1-b',
				'level-2': {
					a: 'level-2-a',
					b: 'level-2-b',
				},
			},
		});
	});

	describe('options', () => {
		it('mapKey', () => {
			expect(requireFolder('./tests/dummy-folders/map-key', {
				mapKey (rawKey) {
					return rawKey.toUpperCase();
				},
			})).to.deep.equal({
				A: 'value-a',
				B: 'value-b',
				C: 'value-c',
			});
		});

		it('normalizeKeys', () => {
			expect(requireFolder('./tests/dummy-folders/normalize-keys', { normalizeKeys: true })).to.deep.equal({
				a_a_a: 'value-a',
				b_b_b: 'value-b',
				cc_cc_cc: 'value-c',
				dd_d_d: 'value-d',
			});
		});

		it('camelCase', () => {
			expect(requireFolder('./tests/dummy-folders/camel-case', { camelCase: true })).to.deep.equal({
				aaBbCc: 'aa bb cc',
				aaaBbbCcc: 'aaa_bbb_ccc',
				aaaaBbbbCccc: 'aaaa-bbbb-cccc',
			});
		});

		it('include', () => {
			expect(requireFolder('./tests/dummy-folders/include', {
				include: ['public'],
			})).to.deep.equal({
				a: 'aaa',
				public: {
					path: resolve(__dirname, 'dummy-folders/include/public'),
					isFile: false,
					name: 'public',
					entries: {
						'style.css': {
							base: 'style',
							ext: 'css',
							name: 'style.css',
							path: resolve(__dirname, 'dummy-folders/include/public/style.css'),
							isFile: true,
						}
					}
				},
			});
		});

		it('include json', () => {
			expect(requireFolder('./tests/dummy-folders/include-json', {
				include: ['.json'],
			})).to.deep.equal({
				a: 'aaa',
				configurations: {
					configs: {
						color: 'red'
					}
				},
			});
		});

		it('exclude', () => {
			expect(requireFolder('./tests/dummy-folders/exclude', {
				exclude: ['c', 'ignored.js'],
			})).to.deep.equal({
				A: 'A',
				B: {
					b: 'bbb'
				}
			});
		});

		it('groups', () => {
			expect(requireFolder('./tests/dummy-folders/groups', {
				groups: {
					letters: ['a', 'b', 'c'],
				},
			})).to.deep.equal({
				x: 'xx',
				letters: {
					a: 'aaa',
					b: 'bbb',
					c: 'ccc',
				},
			});
		});

		it('hooks', () => {
			expect(requireFolder('./tests/dummy-folders/hooks', {
				hooks: {
					aaa: (requiredModule, ctxObj, entryMap) => {
						expect(requiredModule).to.equal('my-value');
						expect(ctxObj).to.be.an('object');
						expect(entryMap.name).to.equal('aaa.js');
						ctxObj.myKey = requiredModule;
					},
				},
			})).to.deep.equal({myKey: 'my-value'});
		});

		it('hooks & normalizeKeys', () => {
			expect(requireFolder('./tests/dummy-folders/hook-and-normalize', {
				normalizeKeys: true,
				hooks: {
					a_bb_c: (requiredModule, ctxObj, entryMap) => {
						expect(requiredModule).to.equal('my-value');
						expect(ctxObj).to.be.an('object');
						expect(entryMap.name).to.equal('a-bb   c.js');
						ctxObj.myKey = requiredModule;
					},
				},
			})).to.deep.equal({myKey: 'my-value'});
		});
	});
});
