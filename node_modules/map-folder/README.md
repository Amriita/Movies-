[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://travis-ci.org/taitulism/map-folder.svg?branch=develop)](https://travis-ci.org/taitulism/map-folder)

map-folder
==========
Create a JSON representation of a folder structure tree.

Installation
------------
```sh
$ npm install map-folder
```

Usage
-----
```js
const mapFolder = require('map-folder');

// sync
const result = mapFolder('path/to/folder', {options});

// Async
const resultPromise = mapFolder('path/to/folder', {async: true});

```

Result
-----
Example folder structure:
```
└─ my-project
   ├─ common
   │  └─ utils.js
   └─ index.js
```

Results:
```js
{
    path: 'path/to/folder',
    isFile: false,
    name: 'my-project',
    entries: {
        'common': {
            path:'path/to/folder/common',
            name: 'common',
            isFile: false,
            entries: {
                "utils.js": {
                    path:'path/to/folder/common/utils.js',
                    isFile: true,
                    name: 'utils.js',
                    base: 'utils',
                    ext: 'js',
                }
            }
        },
        'index.js': {
            path:'path/to/folder/index.js',
            isFile: true,
            name: 'index.js',
            base: 'index',
            ext: 'js',
        }
    }
};
```

## API
------------------------------------------------------------------------
## `mapFolder(path, options)`
### Arguments:
* **path** - A path to an existing folder.
* **options** - Exclude/Include items. See below.

### Return:
A JSON object (or a promise for JSON) that represents the target folder structure.

### Options
* [async](#async)
* [skipEmpty](#skipEmpty)
* [exclude](#exclude)
* [include](#include)
* [filter](#filter)


---------------------------------------------------------------------------------------------------
### `async`
Type: Boolean  
Set to `true` when you want `map-folder` to map asyncronously and return a promise.  
Default is `false` (sync).


### `skipEmpty`
Type: Boolean  
Empty folders are mapped by default but when using the `include` option empty folders are skipped by default. Change this behavior by setting `skipEmpty` with a boolean.
```js
mapFolder('./my-project', {
    include: ['.js', '.json'],
    skipEmpty: false
})
```


### `include` & `exclude`
By default all entries (file & folders) are mapped recursively. Use the `exclude` option to skip/ignore certain entries. Using the `include` option means *only* map the given items.


Both are array of strings, which are the entry names or file extensions you want to map. File extensions should start with a dot (e.g. `'.log'`).  
`include` also accept objects, see below.

Both are compared to the entry full name (and extension) by lower-cased comparison, meaning an `'abc'` item will also match an `'ABC'` folder.

When used together, excluded items will be substract from the included entries (include comes first). The only exception is when you include a folder, then it will be mapped completely (by default), with no exclusions. You can include sub-folders with their own `options`, with their own include/exclude lists etc.


### `exclude`
Type: Array of strings  
Use the `exclude` option to skip/ignore certain entries. Items are names and extensions.

```js
// map everything but "node_modules"
mapFolder('./my-project', {
    exclude: ['node_modules']
})

// map everything but "node_modules" and log files
mapFolder('./my-project', {
    exclude: ['node_modules', '.log']
})
```

### `include`
Type: Array of strings and objects  
Use the `include` option when you only want to map certain entries in the target folder. Items are names and extensions.

```js
// only map js files & the package.json file
mapFolder('./my-project', {
    include: ['.js', 'package.json']
})
```

By default, when including a folder name, the whole folder will be mapped, regardless of other options, including all entries in that folder. If you want a sub-folder to be mapped with its own rules you can pass in an object. This object is an `options` object but should also have the folder name (a `name` property).

```js
// map all .js files in the target folder and 
// all .svg files in "icons" sub-folder
mapFolder('./my-project', {
    include: [
        '.js',
        {
            name: 'icons',
            include: ['.svg']
        }
    ]
})
```

The `async` option will be ignored for sub-folders, and they will all share the initial top `async` option value.


### `filter`
Type: Predicate Function   
If you need more control over which entries to map and which should be skipped you can pass a function to the `filter` option. This function gets called for every entry that was not handled by your `include`/`exclude` options. It gets called with an `entryMap` object (see below).

Return `true` to map the entry or `false` to skip it.
```js
// map all folders and files that starts with an "a"
mapFolder('./my-project', {
    filter: ({isFile, base}) => !isFile || base.startsWith('a')
})
```


## Entry Map Object
Every entry in the result (including the result itself) holds the following properties:  

| Prop name  | Type    | Description                                     |
|------------|---------|-------------------------------------------------|
| `name`     | String  | The whole entry name. Includes file extensions. |
| `path`     | String  | the absolute path to the entry.                 |
| `isFile`   | Boolean | `true` for folders, `false` for files.          |


Each type has its own additional properties:
* **Folder**
    | Prop name | Type   | Description                                                              |
    |-----------|--------|--------------------------------------------------------------------------|
    | `entries` | Object | A JSON object of the folder's child `entryMap`s (sub-folders and files). |

* **File**
    | Prop name | Type   | Description                          |
    |-----------|--------|--------------------------------------|
    | `base`    | String | The file name without the extension. |
    | `ext`     | String | The file extension without a dot.    |

> There are other entry types like symlinks, currently out of this module's scope.
