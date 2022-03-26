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
        callback(null, content)
      })
    })
    .catch(err => {
      callback(err)
    })
};

function spiderLinks(currentUrl, body, nesting, callback) {
  if (nesting === 0) {
    return process.nextTick(callback);
  }

  const links = utilities.getPageLinks(currentUrl, body);
  function iterate(index) {
    if (index === links.length) {
      return callback();
    }
    spider(links[index], nesting - 1,  err => {
      if (err) {
        return callback(err);
      }
      iterate(index + 1)
    })
  }

  iterate(0)
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
  } else if (downloaded) {
    console.log(`Completed the download of "${filename}"`)
  } else {
    console.log(`"${filename}" was already downloaded`)
  }
})
