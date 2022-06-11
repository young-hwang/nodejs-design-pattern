'use strict';

const thunkify = require('thunkify');
const co = require('co');
const urllib = require('urllib');
const fs = require("fs");
const path = require("path");

const TaskQueue = require('./taskQueue');
const mkdirp = thunkify(require('mkdirp'));
const readFile = thunkify(fs.readFile);
const writeFile = thunkify(fs.writeFile);
const nextTick = thunkify(process.nextTick);
const utilities = require("./utilities");
const downloadQueue = new TaskQueue(2);

function* download(url, filename) {
  console.log(`Downloading ${url}`)
  const response = yield urllib.requestThunk(url);
  const body = response.data.toString();
  yield mkdirp(path.dirname(filename));
  yield writeFile(filename, body);
  console.log(`Downloaded and saved ${url}`);
  return body;
}

function spiderLinks(currentUrl, body, nesting) {
  if (nesting === 0) {
    return nextTick();
  }
  return callback => {
    let completed = 0, hasErrors = false;
    const links = utilities.getPageLinks(currentUrl, body);
    if (links.length === 0) {
      return process.nextTick(callback);
    }

    function done(err, result) {
      if (err && !hasErrors) {
        hasErrors = true;
        return callback(err);
      }
      if (++completed === links.length && !hasErrors) {
        callback();
      }
    }

    links.forEach(link => {
      downloadQueue.pushTask(function* (){
        yield spider(link, nesting - 1);
        done();
      });
    })
  }
}

let spidering = new Map();
function* spider(url, nesting) {
  if(spidering.has(url)) {
    return nextTick();
  }
  spidering.set(url, true);

  let filename = utilities.urlToFilename(url);
  let body;
  try {
    body = yield readFile(filename, 'utf8');
  } catch(err) {
    if(err.code !== 'ENOENT') {
      throw err;
    }
    body = yield download(url, filename);
  }
  yield spiderLinks(url, body, nesting);
}

co(function* () {
  try {
    yield spider(process.argv[2], 1);
    console.log(`Download complete`)
  } catch (err) {
    console.log(err)
    process.exit()
  }
});
