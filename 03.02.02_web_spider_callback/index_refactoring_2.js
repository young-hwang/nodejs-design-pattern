'use strict';

const axios = require('axios')
// const request = require('request'); deprecated
const fs = require('fs')
const mkdirp = require('mkdirp')
const path = require('path')
const utilities = require('./utilities')

function saveFile(filename, content, callback) {
  mkdirp(path.dirname(filename), (err) => {       // 3
    if (err) {
      return callback(err)
    }
    fs.writeFile(filename, content, callback)   // 4
  })
}

function spider(url, callback) {
  const filename = utilities.urlToFilename(url)
  fs.exists(filename, (exists) => {
    if (exists) {
      return callback(null, filename, false)
    }
    console.log(`Downloading ${url}`)
    request(url, (err, response, body) => {
      if (err) {
        return callback(err)
      }
      saveFile(filename, body, callback)
    })
  })
}

spider(process.argv[2], (err, filename, downloaded) => {
  if (err) {
    console(err)
  } else if (downloaded) {
    console.log(`Completed the download of "${filename}"`)
  } else {
    console.log(`"${filename}" was already downloaded`)
  }
})