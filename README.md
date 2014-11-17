# bulkop [![npm version](https://badge.fury.io/js/bulkop.svg)](https://www.npmjs.org/package/bulkop) [![build status](https://travis-ci.org/myst729/bulkop.svg)](https://travis-ci.org/myst729/bulkop)

Bulk image optimization tool.

## Installation

```
npm install bulkop --save
```

## Usage

### Use as a node module

```js
var bulkop = require('bulkop')

bulkop('path/to/the/folder/of/images')
```


### Use as a CLI tool

Install as a global module:
```
$ npm install bulkop -g
```

Open CLI and navigate to the directory contains your images, use the command to optimize all images under the directory, including sub directories:
```bash
bulkop
```

You could also specify a relative sub directory:
```bash
bulkop images/
```


## Screenshot

![Bulkop](https://raw.githubusercontent.com/myst729/bulkop/master/screenshots/screenshot.png)


## License

MIT © [Leo Deng](http://myst729.github.io/)
