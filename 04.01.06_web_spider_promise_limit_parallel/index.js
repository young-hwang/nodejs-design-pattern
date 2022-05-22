'use strict';

const axios = require("axios");
const fs = require("fs");
const path = require("path");
const utilities = require("./utilities");
const TaskQueue = require("./taskQueue");

const readFile = utilities.promisify(fs.readFile);
const writeFile = utilities.promisify(fs.writeFile);
const mkdirp = utilities.promisify(require("mkdirp"));

const downloadQueue = new TaskQueue(2);

const download = (url, filename) => {
  console.log(`Downloading ${url}`);
  let body;
  return axios
    .get(url)
    .then(response => {              // 2
      body = response.data;
      return mkdirp(path.dirname(filename))
    })
    .then(() => {
      writeFile(filename, body)   // 4
    })
    .then(() => {
      console.log(`Downloaded and saved: ${url}`);
      return body;
    })
};

function spiderLinks(currentUrl, body, nesting) {
  let promise = Promise.resolve();
  if (nesting === 0) {
    return promise;
  }
  const links = utilities.getPageLinks(currentUrl, body);
  if (links.length === 0) {
    return promise;
  }
  return new Promise((resolve, reject) => {
    let completed = 0;
    let errored = false;
    links.forEach(link => {
      let task = () => {
        return spider(link, nesting - 1).then(() => {
          if (++completed === links.length) {
            resolve();
          }
        }).catch(() => {
          if (!errored) {
            errored = true;
            reject();
          }
        });
      }
      downloadQueue.pushTask(task());
    })
  })
}

function spider(url, nesting) {
  const filename = utilities.urlToFilename(url)
  return readFile(filename, 'utf8')
    .then(
      body => spiderLinks(url, body, nesting),
      err => {
        if (err.code !== 'ENOENT') {
          throw err;
        }
        return download(url, filename)
          .then(body => spiderLinks(url, body, nesting));
      });
}

spider(process.argv[2], 1)
  .then(() => console.log(`Download complete`))
  .catch(err => console.log(err));
