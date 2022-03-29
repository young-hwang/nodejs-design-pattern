'use strict';

// const request = require('request'); deprecated
const axios = require("axios");
const fs = require("fs");
const mkdirp = require("mkdirp");
const path = require("path");
const utilities = require("./utilities");

const saveFile = (filename, content, callback) => {
  mkdirp(path.dirname(filename), (err) => {       // 3
    if (err) {
      return callback(err)
    }
    fs.writeFile(filename, content, callback);   // 4
  })
};

const download = (url, filename, callback) => {
  axios
    .get(url)
    .then(res => {                                    // 2
      const content = res.data;
      saveFile(filename, content, (err) => {
        if (err) {
          callback(err)
        }
        console.log(`Downloaded and saved: ${url}`);
        callback(null, content)
      })
    })
    .catch(err => {
      callback(err)
    })
};

function spiderLinks(currentUrl, body, nesting, callback) {
  if (nesting === 0) {
    return process.nextTick(callback)
  }

  const links = utilities.getPageLinks(currentUrl, body)

  if (links.length === 0) {
    return process.nextTick(callback)
  }

  let completed = 0
  let hasErrors = false

  function done(err) {
    if (err) {
      hasErrors = true
      return callback(err)
    }
    if (++completed === links.length && !hasErrors) {
      return callback();
    }
  }

  links.forEach(link => {
    spider(link, nesting - 1, done)
  })
}

function spider(url, nesting, callback) {
  const filename = utilities.urlToFilename(url)
  fs.readFile(filename, 'utf8', (err, body) => {
    if (err) {
      if (err.code !== 'ENOENT') {
        return callback(err)
      }
      return download(url, filename, (err, body)  => {
        if (err) {
          callback(err)
        }
        spiderLinks(url, body, nesting, callback)
      })
    }

    spiderLinks(url, body, nesting, callback)
  })
}

spider(process.argv[2], 1, (err, filename, downloaded) => {
  if (err) {
    console.log(err)
    process.exit()
  } else if (downloaded) {
    console.log(`Download complete`)
  }
})
