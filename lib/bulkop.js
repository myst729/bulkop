var fs = require('fs')
var path = require('path')
var async = require('async')
var colors = require('colors')

var imagemin = require('imagemin')
var imageminGifsicle = require('imagemin-gifsicle')
var imageminJpegtran = require('imagemin-jpegtran')
var imageminOptipng = require('imagemin-optipng')
var imageminSvgo = require('imagemin-svgo')

var totalBytes = 0
var totalSavedBytes = 0
var optimizationQueue = []

function optimizeImage(p, ext) {
  return function(next) {
    var start = Date.now()
    var stat = fs.statSync(p)

    function callback(before, after) {
      var savedBytes = before - after
      var saved = parseInt(100 * savedBytes / before, 10)
      totalBytes += before
      totalSavedBytes += savedBytes
      console.log('[BULKOP]'.bgGreen.black + ' %s ' + '[%s% saved]'.yellow + ' (%dms)'.grey, path.basename(p), saved, Date.now() - start)
      next()
    }

    switch(ext) {
      case '.gif':
        imagemin([p], path.dirname(p), {
          plugins: [ imageminGifsicle({ interlaced: true }) ]
        }).then(() => {
          callback(stat.size, fs.statSync(p).size)
        })
        break
      case '.jpg':
      case '.jpeg':
        imagemin([p], path.dirname(p), {
          plugins: [ imageminJpegtran({ progressive: true }) ]
        }).then(() => {
          callback(stat.size, fs.statSync(p).size)
        })
        break
      case '.png':
        imagemin([p], path.dirname(p), {
          plugins: [ imageminOptipng({ optimizationLevel: 3 }) ]
        }).then(() => {
          callback(stat.size, fs.statSync(p).size)
        })
        break
      case '.svg':
        imagemin([p], path.dirname(p), {
          plugins: [ imageminSvgo() ]
        }).then(() => {
          callback(stat.size, fs.statSync(p).size)
        })
        break
    }
  }
}

function handleDirectory(dir) {
  try {
    var files = fs.readdirSync(dir)
  } catch(e) {
    console.log('%s Directory %s does not exist.', '[WARNING]'.bgRed, dir.cyan)
    return
  }

  for(var i = 0; i < files.length; i++) {
    var p = path.join(dir, files[i])
    var stat = fs.statSync(p)

    if(stat.isDirectory()) {
      handleDirectory(p)
    } else if(stat.isFile()) {
      var ext = path.extname(p).toLowerCase()
      switch(ext) {
        case '.jpg':
        case '.jpeg':
        case '.png':
        case '.gif':
        case '.svg':
          optimizationQueue.push(optimizeImage(p, ext))
          break
      }
    }
  }
}

function bulkOptimize(basedir, subdir) {
  var directory = (typeof subdir === 'string') ? path.join(basedir, subdir) : basedir
  async.series([
    function(next) {
      console.log('[BULKOP]'.bgGreen.black + ' Optimization Start'.cyan)
      console.log('----------------------------------------------')
      handleDirectory(directory)
      next()
    },
    function(next) {
      async.parallel(optimizationQueue, function(err, result) {
        next()
      })
    },
    function(next) {
      console.log('----------------------------------------------')
      console.log('[BULKOP]'.bgGreen.black + ' %s'.cyan + ' bytes saved totally, ' + '%s%'.cyan + ' on average', totalSavedBytes, parseInt(100 * totalSavedBytes / totalBytes, 10))
      next()
    }
  ])
  return 'finished'
}

module.exports = bulkOptimize
