'use strict';

// const request = require('request'); deprecated
const axios = require("axios");
const fs = require("fs");
const mkdirp = require("mkdirp");
const path = require("path");
const async = require("async");
const utilities = require("./utilities");

const downloadQueue = async.queue((taskData, callback) => {
    spider(taskData.link, taskData.nesting - 1, callback);
  }, 2);

const download = (url, filename, callback) => {
  console.log(`Downloading ${url}`);
  let body;

  async.series([
      callback => {
        axios
          .get(url)
          .then(res => {                                    // 2
            body = res.data;
            callback();
          })
          .catch(err => {
            callback(err)
          })
      },
      mkdirp.bind(null, path.dirname(filename)),
      callback => {
        fs.writeFile(filename, body, callback);
      }
    ],
    err => {
      if (err) {
        return callback(err);
      }
      console.log(`Downloaded and saved: ${url}`);
      callback(null, body);
    }
  )
};

function spiderLinks(currentUrl, body, nesting, callback) {
  if (nesting === 0) {
    return process.nextTick(callback);
  }

  const links = utilities.getPageLinks(currentUrl, body);

  if (links === 0) {
    return process.nextTick(callback);
  }

  let completed = 0, hasErrors = false;

  links.forEach(link => {
    const taskData = {link: link, nesting: nesting};
    downloadQueue.push(taskData, err => {
      if (err) {
        hasErrors = true;
        return callback(err);
      }
      if (++completed === links.length && !hasErrors) {
        callback();
      }
    });
  })

  async.each(links, (link, callback) => {
    spider(link, nesting - 1, callback)
  }, callback);
}

function spider(url, nesting, callback) {
  const filename = utilities.urlToFilename(url)
  fs.readFile(filename, 'utf8', (err, body) => {
    if (err) {
      if (err.code !== 'ENOENT') {
        return callback(err)
      }
      return download(url, filename, (err, body) => {
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
