'use strict';

import stream from "stream";

const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

class ToFileStream implements stream.Writable {

  constructor() {
    super({ objectMode: true });
  }

  _write(chunk, encoding, callback) {
    mkdirp(path.dirname(chunk.path), err => {

    });
  }

}

module.exports = ToFileStream;
