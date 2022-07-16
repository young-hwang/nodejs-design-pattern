'use strict';

const fs = require('fs');
const split = require('split');
const axios = require('axios');
const throwParallel = require('throw-parallel');

fs.createReadStream(process.argv[2])
  .pipe(split())
  .pipe(throwParallel.obj({ concurrency: 2 }, (url, enc, done) => {
    if (!url) return done();
    axios
      .get(url)
      .then(res => {
        this.push(url + ' is up\n');
        done();
      })
      .catch(err => {
        this.push(url + ' is down\n');
        done();
      })
  }))
  .pipe(fs.createWriteStream('result.txt'))
  .on('finish', () => console.log('All urls were checked'));