'use strict';

const thunkify = require('thunkify');
const co = require('co');

const urllib = require('urllib');
const fs = require("fs");
const path = require("path");

const mkdirp = thunkify(require('mkdirp'));
const readFile = thunkify(fs.readFile);
const writeFile = thunkify(fs.writeFile);
const nextTick = thunkify(process.nextTick);
const utilities = require("./utilities");

function* download (url, filename) {
  console.log(`Downloading ${url}`)
  const response = yield urllib.requestThunk('https://young-hwang.github.io/');
  const body = response.data.toString();
  yield mkdirp(path.dirname(filename));
  yield writeFile(filename, body);
  console.log(`Downloaded and saved ${url}`);
  return body;
}

function* spiderLinks(currentUrl, body, nesting) {
  if (nesting === 0) {
    return nextTick();
  }
  const links = utilities.getPageLinks(currentUrl, body);
  for (let i = 0; i < links.length; i++) {
    yield spider(links[i], nesting - 1);
  }
}

function* spider(url, nesting) {
  const filename = utilities.urlToFilename(url)
  let body
  try {
    body = yield readFile(filename, 'utf8');
  } catch (err) {
    if (err.code !== 'ENOENT') {
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
