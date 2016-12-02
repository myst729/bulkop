#! /usr/bin/env node

var assert = require('assert')
var bulkop = require('../lib/bulkop')

assert.equal(bulkop(process.cwd(), 'test'), 'finished', 'Bulk action failed.')
