'use strict';

// const request = require('request'); deprecated
import axios from "axios";
import fs from "fs";
import mkdirp from "mkdirp";
import path from "path";
import utilities from "./utilities";

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
        callback(null)
      })
    })
    .catch(err => {
      callback(err)
    })
};

function spider(url, callback) {
  const filename = utilities.urlToFilename(url)
  fs.readFile(filename, 'utf8', (err, body) => {

  })
  fs.exists(filename, (exists, content) => {                     // 1
    if (exists) {
      callback(null, filename, false)
    }
    download(url, filename, (err)  => {
      if (err) {
        callback(err)
      }
      callback(null, filename, true)
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
