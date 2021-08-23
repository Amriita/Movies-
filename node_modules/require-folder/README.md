[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://travis-ci.org/taitulism/require-folder.svg?branch=develop)](https://travis-ci.org/taitulism/require-folder)

require-folder
==============
Recursively require all files within a folder.


Installation
------------
```sh
$ npm install require-folder
```

Usage
-----
```js
const requireFolder = require('require-folder');

const result = requireFolder('path/to/target-folder', options);
```

### Example folder structure:
```
└─ target-folder
   ├─ controller.js
   ├─ foo
   │  ├─ index.js
   │  ├─ bar.js
   │  └─ baz.js
   └─ utils
      ├─ string_utils.js
      └─ array_utils.js
```

### Example results:
```js
result = {
    controller: require('target-folder/controller'),
    foo: require('target-folder/foo'),
    utils: {
        string_utils: require('target-folder/utils/string_utils')
        array_utils: require('target-folder/utils/array_utils')
    }
}
```

Similar to Node's native `require` behavior, when a folder has an `index.js` file it will be the only export for that folder.  
When there's no `index.js` file, all `.js` files will be required individually.



## API
------------------------------------------------------------------------
## `requireFolder(path, options)`
### Arguments:
* **path** - A string, a folder path to require.
* **options** - A configuration object. See below.

### Return:
An object contains all the required modules in the target folder. The object's structure is generally a representation of the folder.

## Options
* [camelCase](#camelcase)
* [normalizeKeys](#normalizekeys)
* [mapKey](#mapKey)
* [groups](#groups)
* [hooks](#hooks)
* [exclude](#exclude)
* [include](#include)



### `camelCase`
When set to `true`, converts required modules\` names into camelCase style. Any character that is not a letter, a number or an underscore is removed. This enables using js dot notation when using the result object.

Example:
```
└─ my utils.js
```
```js
requireFolder('./target-folder', {
    camelCase: true
})
```
```js
// when `false` (default)
result['my utils']

// when `true`
result.myUtils
``` 


### `normalizeKeys`
When set to `true`, converts dashes and spaces in required modules\` names to underscores. This enables using js dot notation when using the result object.

Example:
```
└─ my utils.js
```
```js
requireFolder('./target-folder', {
    normalizeKeys: true
})
```
```js
// when `false` (default)
result['my utils']

// when `true`
result.my_utils
``` 

>Multiple dashes and spaces in a row are merged into a single underscore.


### `mapKey`
When the `camelCase` and `normalizeKeys` options are not enough, you can rename the required modules\` by passing a mapper function to the `mapKey` option. This function gets called with the original entry name (file/folder). The returned string will be used as the new prop name on the result object.

>`mapKey` function is called last, after any other conversion made by `camelCase` or `normalizeKeys`.

Example:
```
└─ target-folder
   ├─ common-utils.js
   ├─ HELLO.js
   └─ WORLD.js
```
```js
requireFolder('./target-folder', {
    mapKey (name) {
        if (name === 'common-utils') {
            return '$utils';
        }
        else {
            return name.toLowerCase();
        }
    }
})
```
```js
result = {
    $utils: require('target-folder/common-utils'),
    hello: require('target-folder/HELLO'),
    world: require('target-folder/WORLD'),
}
```



### `groups`
Alias: `group`  
You can group multiple items under one namespace property.

Example:
```
└─ target-folder
   ├─ red.js
   ├─ green.js
   ├─ blue.js
   └─ utils.js
```
```js
requireFolder('./target-folder', {
    group: {
        colors: ['red', 'green', 'blue'],
    },
})
```
```js
result = {
    utils: require('target-folder/utils'),
    colors: {
        red: require('target-folder/red'),
        green: require('target-folder/green'),
        blue: require('target-folder/blue'),
    }
}
```



### `hooks`
Sometimes you need even more control over the requiring details. You can use the `hooks` option for custom requiring certain entries (files or folder). 

`hooks` should be an object that its keys are the names of the entries (files or folders) you would like to customize and values are their hook functions.

>`hooks` keys will match resolved keys, after any conversions made by `camelCase`, `normalizeKeys` or `mapKey`.


#### Hook Function Arguments
* `requiredModule` - the actual exports of the current entry.
* `context` - the parent folder context object which current entry will be required into.
* `entryMap` - an entry meta data object. Contains its path, type, name, base name & extension (if file) or its entries (if folder).

See [map-folder](https://github.com/taitulism/map-folder/#entry-map-object) docs for more details about the `entryMap` object.


Example:
```
└─ target-folder
   └─ my-file.js
```
```js
requireFolder('./target-folder', {
    camelCase: true,
    hooks: {
        myFile: (requiredModule, contextObj, entryMap) => {
            if (condition) {
                contextObj.foo = requiredModule;
            }
            else {
                contextObj.bar = requiredModule;
            }
        },
    }
})
```
```js
result = {
    foo: require('target-folder/my-file'),
    // or
    bar: require('target-folder/my-file'),
}
```


### `exclude`
A list of file & folder names to skip. See [map-folder](https://github.com/taitulism/map-folder/#map-folder) docs for more details.

```
└─ target-folder
   ├─ foo.js
   ├─ bar.js
   └─ old-version
      ├─ foo.js
      └─ bar.js
```
```js
const result = requireFolder('./target-folder', {
    exclude: ['old-version']
});
```
```js
result = {
    foo: require('target-folder/foo'),
    bar: require('target-folder/bar'),
}
```


### `include`
A list of file & folder names and extensions to map and require. Folders are only mapped (**not required**) and extensions are required (currently only supporting `.json`).
See [map-folder](https://github.com/taitulism/map-folder/#map-folder) docs for more details.

```
└─ target-folder
   ├─ foo.js
   ├─ styles
   │  ├─ reset.css
   │  └─ main.css
   └─ config.json
```
```js
const result = requireFolder('./target-folder', {
    include: ['styles', '.json']
});
```
```js
result = {
    foo: require('target-folder/foo'),
    config: require('target-folder/config.json'),  // <-- require json files
    styles: {                                      // <-- only maps folders
        path: 'path/to/target-folder/style',
        isFile: false,
        name: 'styles',
        entries: {
            'reset.css': {
                base: 'reset',
                ext: 'css',
                name: 'reset.css',
                path:'path/to/target-folder/styles/reset.css',
                isFile: true,
            }
            'main.css': {
                base: 'main',
                ext: 'css',
                name: 'main.css',
                path:'path/to/target-folder/styles/main.css',
                isFile: true,
            }
        }
    }
}
```
