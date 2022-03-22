'use strict';

const axios = require('axios')
// const request = require('request'); deprecated
const fs = require('fs')
const mkdirp = require('mkdirp')
const path = require('path')
const utilities = require('./utilities')

function spider(url, callback) {
  const filename = utilities.urlToFilename(url)
  fs.exists(filename, (exists) => {                     // 1
    if (exists) {
      callback(null, filename, false)
    }
    console.log(`Downloading ${url}`)
    axios
      .get(url)
      .then(res => {                                    // 2
        mkdirp(path.dirname(filename), (err) => {       // 3
          if (err) {
            return callback(err)
          }
          fs.writeFile(filename, res.data, (err) => {   // 4
            if (err) {
              return callback(err)
            }
            callback(null, filename, true)
          })
        })
      })
      .catch(err => {
        callback(err)
      })
  })
}

spider(process.argv[2], (err, filename, downloaded) => {
  if (err) {
    console.log(err)
  } else if (downloaded) {
    console.log(`Completed the download of "${filename}"`)
  } else {
    console.log(`"${filename}" was already downloaded`)
  }
})
